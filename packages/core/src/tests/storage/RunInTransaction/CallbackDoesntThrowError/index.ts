import { StorageScenario } from "src/tests/storage/StorageScenario";
import { GetStorageFunc } from "src/tests/types";
import { CommitTransaction } from "./CommitTransaction";
import { EndTransaction } from "./EndTransaction";
import { ReturnCallbackReturnValue } from "./ReturnCallbackReturnValue";

export class CallbackDoesntThrowError extends StorageScenario {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  /**
   * Seeder: None
   *
   * Post-processor: Should return an issue with the given id.
   */
  commit_transaction = new CommitTransaction(this.getTestObject);

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
  return_callback_return_value = new ReturnCallbackReturnValue(
    this.getTestObject
  );

  run() {
    describe("given the callback doesn't throw an error", () => {
      this.callHooks();
      this.commit_transaction.run();
      this.end_transaction.run();
      this.return_callback_return_value.run();
    });
  }
}
