import { GetStorageFunc } from "dev/types";
import { StorageTest } from "../StorageTest";

export class ChangeReadyStateToFalse extends StorageTest {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  run(): void {
    it("should change the storage ready state to false", async () => {
      const storage = await this.getStorage();
      await storage.init();
      expect(storage.ready).toBe(true);
      await storage.close();
    });
  }
}
