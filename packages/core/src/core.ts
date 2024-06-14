import {
  Issue,
  Occurrence,
  StdChannelLog,
  Storage,
  SystemInfo,
} from "@codewatch/types";
import { createHash } from "crypto";
import os from "os";
import { format } from "util";

export type CoreOptions = {
  stdoutLogRetentionTime?: number;
  stderrLogRetentionTime?: number;
  disableConsoleLogs?: boolean;
};

type RecentLogs = {
  logs: StdChannelLog[];
  retentionTime: number;
};

export type CaptureDataOpts = {
  name?: string;
  message?: string;
};

export class Core {
  private _stdoutRecentLogs: RecentLogs = { logs: [], retentionTime: 5000 };
  private _stderrRecentLogs: RecentLogs = { logs: [], retentionTime: 5000 };
  private _options: CoreOptions = {
    disableConsoleLogs: false,
  };
  private _unhookConsole: (() => void) | null = null;
  private _unhookUncaughtException: (() => void) | null = null;
  private static _instance: Core | null = null;

  private constructor(private _storage: Storage, options?: CoreOptions) {
    this._storage.init();

    if (options) {
      const { stdoutLogRetentionTime, stderrLogRetentionTime, ...theRest } =
        options;
      if (stdoutLogRetentionTime)
        this._stdoutRecentLogs.retentionTime = stdoutLogRetentionTime;
      if (stderrLogRetentionTime)
        this._stderrRecentLogs.retentionTime = stderrLogRetentionTime;

      this._options = { ...this._options, ...theRest };
    }

    if (!this._options.disableConsoleLogs) this._hookConsole();

    this._hookUncaughtException();
  }

  static init(storage: Storage, options?: CoreOptions) {
    if (!Core._instance) Core._instance = new Core(storage, options);
  }

  static getCore() {
    if (!Core._instance) throw new Error("Please call initCodewatch first");
    return Core._instance;
  }

  static async captureError(
    err: unknown,
    unhandled?: boolean,
    extraData?: Occurrence["extraData"]
  ): Promise<void> {
    const instance = Core.getCore();
    if (!instance._storage.ready) return;
    if (!(err instanceof Error) || !err.stack) return;
    if (extraData) {
      if (typeof extraData === "object" && !Array.isArray(extraData)) {
        extraData = JSON.parse(JSON.stringify(extraData));
      } else {
        console.warn(
          "Invalid extraData passed to captureError. extraData must be an object"
        );
        extraData = {};
      }
    }

    const now = new Date();
    const fingerPrint = instance._generateFingerprint(err.name, err.stack);
    const currentTimestamp = now.toISOString();
    let issueId: Issue["id"] | null = null;
    issueId = await instance._storage.findIssueIdByFingerprint(fingerPrint);

    if (!issueId) {
      issueId = await instance._storage.createIssue({
        fingerprint: fingerPrint,
        name: err.name,
        stack: err.stack,
        totalOccurrences: 0,
        lastOccurrenceTimestamp: currentTimestamp,
        lastOccurrenceMessage: err.message,
        archived: false,
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
      extraData,
      systemInfo: instance._getSysInfo(),
    });

    await instance._storage.updateLastOccurrenceOnIssue({
      issueId,
      timestamp: currentTimestamp,
      message: err.message,
      stack: err.stack,
    });
  }

  static async captureData(
    data: Record<any, any>,
    options: CaptureDataOpts = {}
  ) {
    if (typeof data !== "object" || Array.isArray(data) || data == null) return;
    const metaClass = class extends Error {
      constructor() {
        super();
        this.name = options.name || "AnonymousData";
        this.message = options.message || "";
      }
    };
    const error = new metaClass();
    // Remove current location from the stack
    if (error.stack) {
      const lines = error.stack.split("\n");
      lines.splice(1, 2);
      error.stack = lines.join("\n");
    }
    await Core.captureError(error, false, data);
  }

  static async close() {
    const instance = Core.getCore();
    if (instance._unhookConsole) instance._unhookConsole();
    if (instance._unhookUncaughtException) instance._unhookUncaughtException();
    instance._stderrRecentLogs.logs = [];
    instance._stdoutRecentLogs.logs = [];
    await instance._storage.close();
    Core._instance = null;
  }

  private _generateFingerprint(name: string, stack: string) {
    // Normalize the error stack
    const stackFrames = (stack as string)
      .replace(/\d+:\d+/g, "") // removes line and column numbers
      .split("\n")
      .slice(1);
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

    this._unhookConsole = () => {
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

  private _hookUncaughtException() {
    const listener = async (err: Error) => {
      try {
        await Core.captureError(err, true);
      } catch (err) {
        console.error(err);
      }

      if (process.listenerCount("uncaughtException") === 1) process.exit(1);
    };

    const rejectionListener = async (err: unknown) => {
      try {
        await Core.captureError(err, true);
      } catch (err) {
        console.error(err);
      }

      if (process.listenerCount("unhandledRejection") === 1) process.exit(1);
    };
    process.addListener("uncaughtException", listener);
    process.addListener("unhandledRejection", rejectionListener);

    this._unhookUncaughtException = () => {
      process.removeListener("uncaughtException", listener);
      process.removeListener("unhandledRejection", rejectionListener);
    };
  }

  private _getSysInfo() {
    const sysInfo: SystemInfo = {
      deviceMemory: os.totalmem(),
      freeMemory: os.freemem(),
      appMemoryUsage: process.memoryUsage.rss(),
      deviceUptime: os.uptime(),
      appUptime: process.uptime(),
    };

    return sysInfo;
  }
}
