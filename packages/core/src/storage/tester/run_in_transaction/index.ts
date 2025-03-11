import { StorageScenario } from "src/storage/tester/storage_scenario";
import { GetStorageFunc } from "src/storage/tester/types";
import { CallCallbackWithTransaction } from "./call_callback_with_transaction";
import { CallbackDoesntThrowError } from "./callback_doesnt_throw_error";
import { CallbackThrowsError } from "./callback_throws_error";

export class RunInTransaction extends StorageScenario {
  call_callback_with_transaction: CallCallbackWithTransaction;
  call_back_throws_error: CallbackThrowsError;
  call_back_doesnt_throw_error: CallbackDoesntThrowError;

  constructor(getStorage: GetStorageFunc) {
    super(getStorage);

    this.call_callback_with_transaction = new CallCallbackWithTransaction(
      getStorage
    );
    this.call_back_throws_error = new CallbackThrowsError(getStorage);
    this.call_back_doesnt_throw_error = new CallbackDoesntThrowError(
      getStorage
    );
  }

  run() {
    describe("runInTransaction", () => {
      this.callHooks();
      this.call_callback_with_transaction.run();
      this.call_back_throws_error.run();
      this.call_back_doesnt_throw_error.run();
    });
  }
}
