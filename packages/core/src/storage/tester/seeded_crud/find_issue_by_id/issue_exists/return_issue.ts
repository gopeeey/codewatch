import { StorageTest } from "src/storage/tester/storage_test";
import { createCreateIssueData } from "src/storage/tester/utils";
import { Issue, Storage, Transaction } from "src/types";

export class ReturnIssue extends StorageTest<
  { issueId: Issue["id"]; transaction: Transaction },
  Issue | null
> {
  constructor(storage: Storage) {
    super(storage);
  }

  protected runTest(): void {
    this.runJestTest(
      "should return the issue with the supplied id",
      async () => {
        const now = new Date().toISOString();
        const issueData = createCreateIssueData(now);
        const storage = await this.getStorage();
        const transaction = await storage.createTransaction();
        try {
          const issueId = await storage.createIssue(issueData, transaction);

          const expected = await this.seedFunc({ issueId, transaction });
          if (!expected || expected.id !== issueId) {
            throw new Error(
              "Seed function should return an issue with the supplied id"
            );
          }

          const issue = await storage.findIssueById(issueId, transaction);
          await transaction.rollback();
          expect(issue).toEqual(expected);
        } catch (err) {
          await transaction.rollbackAndEnd();
          throw err;
        }

        await transaction.end();
      }
    );
  }
}
