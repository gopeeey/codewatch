import { createHash } from "crypto";
import { format } from "util";
import { Issue, StdChannelLog, Storage } from "./types";

export type CoreOptions = {
  stdoutLogRetentionTime?: number;
  stderrLogRetentionTime?: number;
  disableConsoleLogs?: boolean;
};

type RecentLogs = {
  logs: StdChannelLog[];
  retentionTime: number;
};

export class Core {
  private _stdoutRecentLogs: RecentLogs = { logs: [], retentionTime: 5000 };
  private _stderrRecentLogs: RecentLogs = { logs: [], retentionTime: 5000 };
  private _options: CoreOptions = {
    disableConsoleLogs: false,
  };
  private _unhookConsole: (() => void) | null = null;
  private static _instance: Core | null = null;

  private constructor(private _storage: Storage, options?: CoreOptions) {
    if (options) {
      const { stdoutLogRetentionTime, stderrLogRetentionTime, ...theRest } =
        options;
      if (stdoutLogRetentionTime)
        this._stdoutRecentLogs.retentionTime = stdoutLogRetentionTime;
      if (stderrLogRetentionTime)
        this._stderrRecentLogs.retentionTime = stderrLogRetentionTime;

      this._options = { ...this._options, ...theRest };
    }

    if (!this._options.disableConsoleLogs) {
      this._unhookConsole = this._hookConsole();
    }
  }

  static init(storage: Storage, options?: CoreOptions) {
    if (!Core._instance) Core._instance = new Core(storage, options);
  }

  static getCore() {
    if (!Core._instance) throw new Error("Please call initCodewatch first");
    return Core._instance;
  }

  static async handleError(err: unknown, unhandled?: boolean): Promise<void> {
    const instance = Core.getCore();
    if (!(err instanceof Error) || !err.stack) return;

    const now = new Date();
    const fingerPrint = instance._generateFingerprint(err);
    const currentTimestamp = now.toISOString();
    let issueId: Issue["id"] | null = null;
    issueId = await instance._storage.findIssueIdByFingerprint(fingerPrint); // should cache instance value

    if (!issueId) {
      issueId = await instance._storage.createIssue({
        fingerprint: fingerPrint,
        name: err.name,
        stack: err.stack,
        totalOccurrences: 0,
        lastOccurrenceTimestamp: currentTimestamp,
        lastOccurrenceMessage: err.message,
        muted: false,
        unhandled: Boolean(unhandled),
        createdAt: currentTimestamp,
      });
    }

    instance._cleanUpLogs(
      instance._stdoutRecentLogs,
      now.getTime() - instance._stdoutRecentLogs.retentionTime
    );
    const stdoutLogs = instance._stdoutRecentLogs.logs;

    instance._cleanUpLogs(
      instance._stderrRecentLogs,
      now.getTime() - instance._stderrRecentLogs.retentionTime
    );
    const stderrLogs = instance._stderrRecentLogs.logs;
    await instance._storage.addOccurrence({
      issueId,
      message: err.message,
      timestamp: currentTimestamp,
      stderrLogs,
      stdoutLogs,
    });

    await instance._storage.updateLastOccurrenceOnIssue({
      issueId,
      timestamp: currentTimestamp,
      message: err.message,
    });
  }

  static async close() {
    const instance = Core.getCore();
    if (instance._unhookConsole) instance._unhookConsole();
    instance._stderrRecentLogs.logs = [];
    instance._stdoutRecentLogs.logs = [];
    await instance._storage.close();
    Core._instance = null;
  }

  protected _generateFingerprint(err: Error) {
    // Normalize the error stack
    const stackFrames = (err.stack as string).split("\n").slice(1);
    let normalizedStack = "";
    const cwd = process.cwd();
    for (const frame of stackFrames) {
      if (frame.includes(cwd)) {
        normalizedStack += `${frame.trim()}\n`;
      }
    }
    if (!normalizedStack.length) normalizedStack = stackFrames.join("\n");
    return createHash("sha256").update(normalizedStack).digest("hex");
  }

  private _hookConsole() {
    const oldConsoleLog = console.log;
    const oldConsoleErr = console.error;
    const oldConsoleInfo = console.info;
    const oldConsoleWarn = console.warn;

    console.log = (...args: Parameters<Console["log"]>) => {
      oldConsoleLog(...args);
      this._writeLog(this._stdoutRecentLogs, format(...args));
    };

    console.info = (...args: Parameters<Console["info"]>) => {
      oldConsoleInfo(...args);
      this._writeLog(this._stdoutRecentLogs, format(...args));
    };

    console.error = (...args: Parameters<Console["error"]>) => {
      oldConsoleErr(...args);
      this._writeLog(this._stderrRecentLogs, format(...args));
    };

    console.warn = (...args: Parameters<Console["warn"]>) => {
      oldConsoleWarn(...args);
      this._writeLog(this._stderrRecentLogs, format(...args));
    };

    return () => {
      console.log = oldConsoleLog;
      console.error = oldConsoleErr;
      console.info = oldConsoleInfo;
      console.warn = oldConsoleWarn;
    };
  }

  private _writeLog(target: RecentLogs, log: string) {
    const timestamp = Date.now();
    this._cleanUpLogs(target, timestamp - target.retentionTime);
    target.logs.push({ timestamp, message: log.trim() });
  }

  private _cleanUpLogs(target: RecentLogs, refTimestamp: number) {
    if (!target.logs.length) return;

    // If the last log has exceeded the retention time, empty the array
    if (target.logs[target.logs.length - 1].timestamp < refTimestamp) {
      target.logs.splice(0, target.logs.length);
    } else {
      // If the first log has exceeded the retention time,
      // delete all logs that have exceeded the retention time
      if (target.logs[0].timestamp < refTimestamp) {
        const indexFinder =
          target.logs.length >= 100
            ? this._findLastExpiredLogIndexBinary
            : this._findLastExpiredLogIndexLinear;
        const index = indexFinder(target.logs, refTimestamp);
        if (index > -1) target.logs.splice(0, index + 1);
      }
    }
  }

  private _findLastExpiredLogIndexLinear(
    logs: StdChannelLog[],
    refTimestamp: number
  ) {
    for (let i = 0; i < logs.length; i++) {
      if (logs[i].timestamp < refTimestamp) {
        return i;
      }
    }
    return -1;
  }

  private _findLastExpiredLogIndexBinary(
    logs: StdChannelLog[],
    refTimestamp: number
  ) {
    let min = 0,
      max = logs.length - 1,
      index = -1;

    while (min < max) {
      const mid = Math.floor((min + max) / 2);
      if (logs[mid].timestamp < refTimestamp) {
        min = mid + 1;
        index = mid;
        if (logs[min] && logs[min].timestamp >= refTimestamp) return mid;
      } else {
        max = mid - 1;
        if (logs[max] && logs[max].timestamp < refTimestamp) return max;
      }
    }

    return index;
  }
}
