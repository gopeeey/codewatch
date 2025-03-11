import { GetStorageFunc } from "src/storage/tester/types";
import { StorageTransaction } from "src/storage/transaction";
import { StorageTest } from "../storage_test";

export class CallCallbackWithTransaction extends StorageTest {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  run(): void {
    it("should call it's callback with a transaction instance", async () => {
      const callback = jest.fn();
      const storage = await this.getStorage();
      try {
        await storage.runInTransaction(callback);
        expect(callback).toHaveBeenCalledWith(expect.any(StorageTransaction));
      } catch (err) {
        await storage.close();
        throw err;
      }

      await storage.close();
    });
  }
}
