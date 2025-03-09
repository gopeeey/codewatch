import { StorageScenario } from "src/tests/storage/StorageScenario";
import { GetStorageFunc } from "src/tests/types";
import { EndTransaction } from "../CallbackThrowsError/EndTransaction";
import { RollbackTransaction } from "./RollbackTransaction";
import { ThrowError } from "./ThrowError";

export class CallbackThrowsError extends StorageScenario {
  /**
   * Seeder: None
   *
   * Post-processor: Should return an issue with the given fingerprint.
   * The issue is expected to be null since the transaction should have been rolled back.
   */
  rollback_transaction: RollbackTransaction;

  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  end_transaction: EndTransaction;

  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  throw_error: ThrowError;

  constructor(getStorage: GetStorageFunc) {
    super(getStorage);

    this.rollback_transaction = new RollbackTransaction(getStorage);
    this.end_transaction = new EndTransaction(getStorage);
    this.throw_error = new ThrowError(getStorage);
  }

  run() {
    describe("given the callback throws an error", () => {
      this.callHooks();
      this.rollback_transaction.run();
      this.end_transaction.run();
      this.throw_error.run();
    });
  }
}
