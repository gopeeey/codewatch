import { StorageTest } from "src/storage/tester/storage_test";
import { createCreateIssueData } from "src/storage/tester/utils";
import { Issue, Storage } from "src/types";

export class RollbackTransaction extends StorageTest<
  void,
  void,
  { fingerprint: Issue["fingerprint"] },
  Issue | null
> {
  constructor(storage: Storage) {
    super(storage);
  }

  protected runTest(): void {
    this.runJestTest("should rollback the transaction", async () => {
      const err = new Error("Hello there");
      const fingerprint = "somethingspecial";
      const storage = await this.getStorage();

      try {
        await storage.runInTransaction(async (transaction) => {
          const issueData = createCreateIssueData(new Date().toISOString(), {
            fingerprint,
          });
          await storage.createIssue(issueData, transaction);
          throw err;
        });
      } catch (err) {}

      const issue = await this.postProcessingFunc({ fingerprint });
      expect(issue).toBeNull();
    });
  }
}
