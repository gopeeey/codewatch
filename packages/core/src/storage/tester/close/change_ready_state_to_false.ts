import { Storage } from "src/types";
import { StorageTest } from "../storage_test";

export class ChangeReadyStateToFalse extends StorageTest<void, Storage> {
  constructor(storage: Storage) {
    super(storage);
  }

  protected runTest(): void {
    this.runJestTest(
      "should change the storage ready state to false",
      async () => {
        const storage = await this.seedFunc();
        await storage.init();
        await storage.close();
        expect(storage.ready).toBe(false);
      }
    );
  }
}
