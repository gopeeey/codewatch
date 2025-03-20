import { StorageTest } from "src/storage/tester/storage_test";
import { createCreateIssueData } from "src/storage/tester/utils";
import { Storage } from "src/types";

export class ThrowError extends StorageTest {
  constructor(storage: Storage) {
    super(storage);
  }

  protected runTest(): void {
    this.runJestTest("should throw the error", async () => {
      const err = new Error("Hello there");
      const fingerprint = "somethingspecial";
      const storage = await this.getStorage();

      expect(async () => {
        await storage.runInTransaction(async (transaction) => {
          const issueData = createCreateIssueData(new Date().toISOString(), {
            fingerprint,
          });
          await storage.createIssue(issueData, transaction);

          throw err;
        });
      }).rejects.toThrow(err);
    });
  }
}
