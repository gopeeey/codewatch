import { GetStorageFunc } from "src/tests/types";
import { StorageTest } from "../StorageTest";

export class ChangeReadyStateToFalse extends StorageTest {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  run(): void {
    it("should change the storage ready state to false", async () => {
      const storage = await this.getStorage();
      await storage.close();
      expect(storage.ready).toBe(false);
    });
  }
}
