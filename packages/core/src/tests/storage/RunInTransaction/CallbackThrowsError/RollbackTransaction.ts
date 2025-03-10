import { StorageTest } from "src/tests/storage/StorageTest";
import { GetStorageFunc } from "src/tests/storage/types";
import { createCreateIssueData } from "src/tests/storage/utils";
import { Issue } from "src/types";

export class RollbackTransaction extends StorageTest<
  void,
  void,
  { fingerprint: Issue["fingerprint"] },
  Issue | null
> {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  run(): void {
    it("should rollback the transaction", async () => {
      const err = new Error("Hello there");
      const fingerprint = "somethingspecial";
      const storage = await this.getStorage();

      try {
        try {
          await storage.runInTransaction(async (transaction) => {
            const issueData = createCreateIssueData(new Date().toISOString(), {
              fingerprint,
            });
            await storage.createIssue(issueData, transaction);
            throw err;
          });
        } catch (err) {}
        await storage.close();

        const issue = await this.postProcessingFunc({ fingerprint });
        expect(issue).toBeNull();
      } catch (err) {
        await storage.close();
        throw err;
      }
    });
  }
}
