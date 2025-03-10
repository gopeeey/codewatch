import { StorageTest } from "src/tests/storage/StorageTest";
import { GetStorageFunc } from "src/tests/types";

export class ReturnNull extends StorageTest {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  run(): void {
    it("should return null", async () => {
      const storage = await this.getStorage();
      try {
        const issue = await storage.findIssueById("0");
        expect(issue).toBeNull();
      } catch (err) {
        await storage.close();
        throw err;
      }

      await storage.close();
    });
  }
}
