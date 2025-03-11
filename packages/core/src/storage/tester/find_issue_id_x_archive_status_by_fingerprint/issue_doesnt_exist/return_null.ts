import { StorageTest } from "src/storage/tester/storage_test";
import { GetStorageFunc } from "src/storage/tester/types";

export class ReturnNull extends StorageTest {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  run(): void {
    it("should return null", async () => {
      const storage = await this.getStorage();
      const foundIssue = await storage.findIssueIdxArchiveStatusByFingerprint(
        "123456789012345678"
      );
      await storage.close();

      expect(foundIssue).toBeNull();
    });
  }
}
