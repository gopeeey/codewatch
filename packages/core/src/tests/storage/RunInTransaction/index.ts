import { StorageScenario } from "src/tests/storage/StorageScenario";
import { GetStorageFunc } from "src/tests/types";
import { CallCallbackWithTransaction } from "./CallCallbackWithTransaction";
import { CallbackDoesntThrowError } from "./CallbackDoesntThrowError";
import { CallbackThrowsError } from "./CallbackThrowsError";

export class RunInTransaction extends StorageScenario {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  call_callback_with_transaction = new CallCallbackWithTransaction(
    this.getTestObject
  );

  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  call_back_throws_error = new CallbackThrowsError(this.getTestObject);

  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  call_back_doesnt_throw_error = new CallbackDoesntThrowError(
    this.getTestObject
  );

  run() {
    describe("runInTransaction", () => {
      this.callHooks();
      this.call_callback_with_transaction.run();
      this.call_back_throws_error.run();
      this.call_back_doesnt_throw_error.run();
    });
  }
}
