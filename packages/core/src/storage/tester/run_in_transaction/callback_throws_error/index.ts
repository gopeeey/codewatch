import { StorageScenario } from "src/storage/tester/storage_scenario";
import { Storage } from "src/types";
import { EndTransaction } from "./end_transaction";
import { RollbackTransaction } from "./rollback_transaction";
import { ThrowError } from "./throw_error";

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

  constructor(storage: Storage) {
    super(storage);

    this.rollback_transaction = new RollbackTransaction(storage);
    this.end_transaction = new EndTransaction(storage);
    this.throw_error = new ThrowError(storage);
  }

  protected runScenario() {
    describe("given the callback throws an error", () => {
      this.callHooks();
      this.rollback_transaction.run();
      this.end_transaction.run();
      this.throw_error.run();
    });
  }
}
