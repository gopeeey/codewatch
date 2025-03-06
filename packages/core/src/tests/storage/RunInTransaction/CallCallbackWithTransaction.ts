import { StorageTransaction } from "src/storage/transaction";
import { GetStorageFunc } from "src/tests/types";
import { StorageTest } from "../StorageTest";

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
        await storage.close();
        expect(callback).toHaveBeenCalledWith(expect.any(StorageTransaction));
      } catch (err) {
        await storage.close();
        throw err;
      }
    });
  }
}
