import { StorageScenario } from "src/storage/tester/storage_scenario";
import { GetStorageFunc } from "src/storage/tester/types";
import { CommitTransaction } from "./commit_transaction";
import { EndTransaction } from "./end_transaction";
import { ReturnCallbackReturnValue } from "./return_callback_return_value";

export class CallbackDoesntThrowError extends StorageScenario {
  /**
   * Seeder: None
   *
   * Post-processor: Should return an issue with the given id.
   */
  commit_transaction: CommitTransaction;

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
  return_callback_return_value: ReturnCallbackReturnValue;

  constructor(getStorage: GetStorageFunc) {
    super(getStorage);

    this.commit_transaction = new CommitTransaction(getStorage);
    this.end_transaction = new EndTransaction(getStorage);
    this.return_callback_return_value = new ReturnCallbackReturnValue(
      getStorage
    );
  }

  run() {
    describe("given the callback doesn't throw an error", () => {
      this.callHooks();
      this.commit_transaction.run();
      this.end_transaction.run();
      this.return_callback_return_value.run();
    });
  }
}
