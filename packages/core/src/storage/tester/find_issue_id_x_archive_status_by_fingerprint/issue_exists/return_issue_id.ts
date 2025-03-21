import { StorageTest } from "src/storage/tester/storage_test";
import { GetStorageFunc } from "src/storage/tester/types";
import { createCreateIssueData } from "src/storage/tester/utils";

export class ReturnIssueId extends StorageTest {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  run(): void {
    it("should return the id and archived status of the issue", async () => {
      const now = new Date().toISOString();
      const issueData = createCreateIssueData(now);
      const storage = await this.getStorage();
      const transaction = await storage.createTransaction();
      try {
        const issueId = await storage.createIssue(issueData, transaction);

        const foundIssue = await storage.findIssueIdxArchiveStatusByFingerprint(
          issueData.fingerprint,
          transaction
        );
        await transaction.commitAndEnd();

        if (!foundIssue) throw new Error("Issue not found");
        expect(foundIssue.id).toBe(issueId);
        expect(foundIssue.archived).toBe(false);
      } catch (err) {
        if (!transaction.ended) await transaction.rollbackAndEnd();
        await storage.close();
        throw err;
      }

      await storage.close();
    });
  }
}
