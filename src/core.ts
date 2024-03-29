import { createHash } from "crypto";
import { ErrorData, Storage } from "./types";

export type Options = {
  stdoutLogRetentionTime?: number;
  stderrLogRetentionTime?: number;
};

type RecentLogs = {
  logs: [number, string][];
  retentionTime: number;
};

export class Core {
  private _stdoutRecentLogs: RecentLogs = { logs: [], retentionTime: 5000 };
  private _stderrRecentLogs: RecentLogs = { logs: [], retentionTime: 5000 };

  constructor(private _storage: Storage, options?: Options) {
    if (options) {
      const { stdoutLogRetentionTime, stderrLogRetentionTime } = options;
      if (stdoutLogRetentionTime)
        this._stdoutRecentLogs.retentionTime = stdoutLogRetentionTime;
      if (stderrLogRetentionTime)
        this._stderrRecentLogs.retentionTime = stderrLogRetentionTime;
    }
  }

  async handleError(err: unknown): Promise<void> {
    if (!(err instanceof Error)) throw err;
    if (!err.stack) throw err;

    const fingerPrint = this._generateFingerprint(err);
    const currentTimestamp = new Date().toISOString();
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

    await this._storage.addOccurence({
      errorId,
      message: err.message,
      timestamp: currentTimestamp,
      stderrLogs: [],
      stdoutLogs: [],
    });
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

  private _hookStream(
    stream: NodeJS.WriteStream,
    callback: (...args: Parameters<NodeJS.WriteStream["write"]>) => void
  ) {
    const oldWrite = stream.write.bind(stream);

    stream.write = ((...args: Parameters<NodeJS.WriteStream["write"]>) => {
      callback(...args);
      return oldWrite(...args);
    }) as typeof stream.write;
  }

  private _writeLog(target: RecentLogs, log: string) {
    const timestamp = Date.now();
    this._cleanUpLogs(target, timestamp - target.retentionTime);
  }

  private _cleanUpLogs(target: RecentLogs, refTimestamp: number) {
    if (!target.logs.length) return;

    // If the last log has exceeded the retention time, empty the array
    if (target.logs[target.logs.length - 1][0] < refTimestamp) {
      this._deleteLogs(target.logs, target.logs.length - 1);
    } else {
      // If the first log has exceeded the retention time,
      // delete all logs that have exceeded the retention time
      if (target.logs[0][0] < refTimestamp) {
        const indexFinder =
          target.logs.length >= 100
            ? this._findLastExpiredLogIndexBinary
            : this._findLastExpiredLogIndexLinear;
        const index = indexFinder(target.logs, refTimestamp);
        this._deleteLogs(target.logs, index);
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

  private _deleteLogs(target: RecentLogs["logs"], to: number) {
    target.splice(0, to + 1);
  }
}
