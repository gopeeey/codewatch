import { GetStorageFunc } from "dev/types";
import { StorageTest } from "../StorageTest";

export class ChangeReadyStateToTrue extends StorageTest {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  run(): void {
    it("should change the storage ready state to true", async () => {
      const storage = await this.getStorage(false);
      await storage.init();
      expect(storage.ready).toBe(true);
      await storage.close();
    });
  }
}
