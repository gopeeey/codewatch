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
        let obj: any;
        const callback = async (trx: any) => {
          obj = trx;
        };
        const storage = await this.getStorage();
        await storage.runInTransaction(callback);
        expect(obj).toBeDefined();
        expect(obj instanceof StorageTransaction).toBe(true);
      }
    );
  }
}
