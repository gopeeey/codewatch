import { StorageTest } from "src/storage/tester/storage_test";
import { createCreateIssueData } from "src/storage/tester/utils";
import { Issue, Storage } from "src/types";

export class CommitTransaction extends StorageTest<
  void,
  void,
  { issueId: Issue["id"] },
  Issue | null
> {
  constructor(storage: Storage) {
    super(storage);
  }

  protected runTest(): void {
    this.runJestTest("should commit the transaction", async () => {
      const storage = await this.getStorage();
      const issueData = createCreateIssueData(new Date().toISOString(), {
        resolved: false,
      });

      const id = await storage.runInTransaction(async (transaction) => {
        return await storage.createIssue(issueData, transaction);
      });

      const issue = await this.postProcessingFunc({ issueId: id });
      if (!issue) throw new Error("No issue returned by postProcessingFunc");

      expect(issue).toMatchObject({
        ...issueData,
        id,
        createdAt: expect.any(String),
      });
    });
  }
}
