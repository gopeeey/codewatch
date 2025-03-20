import { StorageTest } from "src/storage/tester/storage_test";
import { Storage } from "src/types";

export class ReturnNull extends StorageTest {
  constructor(storage: Storage) {
    super(storage);
  }

  protected runTest(): void {
    this.runJestTest("should return null", async () => {
      const storage = await this.getStorage();
      const foundIssue = await storage.findIssueIdxArchiveStatusByFingerprint(
        "123456789012345678"
      );

      expect(foundIssue).toBeNull();
    });
  }
}
