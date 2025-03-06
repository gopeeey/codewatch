import { StorageScenario } from "src/tests/storage/StorageScenario";
import { GetStorageFunc } from "src/tests/types";
import { EndTransaction } from "../CallbackThrowsError/EndTransaction";
import { RollbackTransaction } from "./RollbackTransaction";
import { ThrowError } from "./ThrowError";

export class CallbackThrowsError extends StorageScenario {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  /**
   * Seeder: None
   *
   * Post-processor: Should return an issue with the given fingerprint.
   * The issue is expected to be null since the transaction should have been rolled back.
   */
  rollback_transaction = new RollbackTransaction(this.getTestObject);

  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  end_transaction = new EndTransaction(this.getTestObject);

  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  throw_error = new ThrowError(this.getTestObject);

  run() {
    describe("given the callback throws an error", () => {
      this.callHooks();
      this.rollback_transaction.run();
      this.end_transaction.run();
      this.throw_error.run();
    });
  }
}
