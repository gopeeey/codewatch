import { StorageTransaction } from "src/storage/transaction";
import { Storage } from "src/types";
import { StorageTest } from "../storage_test";

export class CallCallbackWithTransaction extends StorageTest {
  constructor(storage: Storage) {
    super(storage);
  }

  protected runTest(): void {
    this.runJestTest(
      "should call it's callback with a transaction instance",
      async () => {
        const callback = jest.fn();
        const storage = await this.getStorage();
        await storage.runInTransaction(callback);
        expect(callback).toHaveBeenCalledWith(expect.any(StorageTransaction));
      }
    );
  }
}
