import { createHash } from "crypto";
import { format } from "util";
import { ErrorData, Storage } from "./types";

export type Options = {
  stdoutLogRetentionTime?: number;
  stderrLogRetentionTime?: number;
  disableConsoleLogs?: boolean;
};

type RecentLogs = {
  logs: [number, string][];
  retentionTime: number;
};

export class Core {
  private _stdoutRecentLogs: RecentLogs = { logs: [], retentionTime: 5000 };
  private _stderrRecentLogs: RecentLogs = { logs: [], retentionTime: 5000 };
  private _options: Options = {
    disableConsoleLogs: false,
  };
  private _unhookConsole: (() => void) | null = null;
  private _closed = false;

  constructor(private _storage: Storage, options?: Options) {
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

  async handleError(err: unknown): Promise<void> {
    if (this._closed) throw new Error("Cannot handle errors after close");
    if (!(err instanceof Error)) throw err;
    if (!err.stack) throw err;

    const now = new Date();
    const fingerPrint = this._generateFingerprint(err);
    const currentTimestamp = now.toISOString();
    let errorId: ErrorData["id"] | null = null;
    errorId = await this._storage.findErrorIdByFingerprint(fingerPrint); // should cache this value

    if (!errorId) {
      errorId = await this._storage.createError({
        fingerprint: fingerPrint,
        name: err.name,
        stack: err.stack,
        totalOccurences: 1,
        lastOccurenceTimestamp: currentTimestamp,
        muted: false,
      });
    }

    this._cleanUpLogs(
      this._stdoutRecentLogs,
      now.getTime() - this._stdoutRecentLogs.retentionTime
    );
    const stdoutLogs = this._stdoutRecentLogs.logs;

    this._cleanUpLogs(
      this._stderrRecentLogs,
      now.getTime() - this._stderrRecentLogs.retentionTime
    );
    const stderrLogs = this._stderrRecentLogs.logs;
    await this._storage.addOccurence({
      errorId,
      message: err.message,
      timestamp: currentTimestamp,
      stderrLogs,
      stdoutLogs,
    });

    await this._storage.updateLastOccurenceOnError({
      errorId,
      timestamp: currentTimestamp,
    });
  }

  async close() {
    this._closed = true;
    if (this._unhookConsole) this._unhookConsole();
    this._stderrRecentLogs.logs = [];
    this._stdoutRecentLogs.logs = [];
    await this._storage.close();
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
    target.logs.push([timestamp, log.trim()]);
  }

  private _cleanUpLogs(target: RecentLogs, refTimestamp: number) {
    if (!target.logs.length) return;

    // If the last log has exceeded the retention time, empty the array
    if (target.logs[target.logs.length - 1][0] < refTimestamp) {
      target.logs.splice(0, target.logs.length);
    } else {
      // If the first log has exceeded the retention time,
      // delete all logs that have exceeded the retention time
      if (target.logs[0][0] < refTimestamp) {
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
    logs: [number, string][],
    refTimestamp: number
  ) {
    for (let i = 0; i < logs.length; i++) {
      if (logs[i][0] < refTimestamp) {
        return i;
      }
    }
    return -1;
  }

  private _findLastExpiredLogIndexBinary(
    logs: [number, string][],
    refTimestamp: number
  ) {
    let min = 0,
      max = logs.length - 1,
      index = -1;

    while (min < max) {
      const mid = Math.floor((min + max) / 2);
      if (logs[mid][0] < refTimestamp) {
        min = mid + 1;
        index = mid;
        if (logs[min] && logs[min][0] >= refTimestamp) return mid;
      } else {
        max = mid - 1;
        if (logs[max] && logs[max][0] < refTimestamp) return max;
      }
    }

    return index;
  }
}

// To be honest this is just so I can commit something today
// I'll resume work on this tomorrow
