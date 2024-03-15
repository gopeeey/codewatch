import { createHash } from "crypto";
import { Storage } from "./types";

export class Core {
  constructor(private _storage: Storage) {}

  async handleError(err: unknown): Promise<void> {
    if (!(err instanceof Error)) return;
    if (!err.stack) return;

    const fingerPrint = this._generateFingerPrint(err);
    // Check storage for an existing error with this fingerprint
    // If error exists, add new occurence of the error
    // If error does not exist, create new error and add new occurence to storage
  }

  protected _generateFingerPrint(err: Error) {
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
