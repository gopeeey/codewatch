import { Storage } from "src/types";
import { StorageTest } from "../storage_test";

export class ChangeReadyStateToTrue extends StorageTest<void, Storage> {
  constructor(storage: Storage) {
    super(storage);
  }

  protected runTest(): void {
    this.runJestTest(
      "should change the storage ready state to true",
      async () => {
        const storage = await this.seedFunc();
        await storage.init();
        expect(storage.ready).toBe(true);
        await storage.close();
      }
    );
  }
}
