import { StorageTest } from "dev/storage/test/StorageTest";
import { GetStorageFunc } from "dev/types";

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

      expect(foundIssue).toBeNull();
      await storage.close();
    });
  }
}
