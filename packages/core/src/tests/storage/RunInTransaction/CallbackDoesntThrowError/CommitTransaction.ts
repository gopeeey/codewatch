import { StorageTest } from "src/tests/storage/StorageTest";
import { createCreateIssueData } from "src/tests/storage/utils";
import { GetStorageFunc } from "src/tests/types";
import { Issue } from "src/types";

export class CommitTransaction extends StorageTest<
  void,
  void,
  { issueId: Issue["id"] },
  Issue | null
> {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  run(): void {
    it("should commit the transaction", async () => {
      const storage = await this.getStorage();
      const issueData = createCreateIssueData(new Date().toISOString(), {
        resolved: false,
      });

      try {
        const id = await storage.runInTransaction(async (transaction) => {
          return await storage.createIssue(issueData, transaction);
        });
        await storage.close();

        const issue = await this.postProcessingFunc({ issueId: id });
        if (!issue) throw new Error("No issue returned by postProcessingFunc");

        expect(issue).toEqual({
          ...issueData,
          id,
          createdAt: expect.any(String),
        });
      } catch (err) {
        await storage.close();
        throw err;
      }
    });
  }
}
