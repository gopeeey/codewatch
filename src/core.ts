import { createHash } from "crypto";
import { ErrorData, Storage } from "./types";

export class Core {
  constructor(private _storage: Storage) {}

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
}
