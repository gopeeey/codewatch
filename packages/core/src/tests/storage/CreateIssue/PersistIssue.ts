import { GetStorageFunc } from "src/tests/storage/types";
import { Issue, Transaction } from "src/types";
import { StorageTest } from "../StorageTest";
import { createCreateIssueData } from "../utils";

export class PersistIssue extends StorageTest<
  void,
  void,
  { id: string; transaction: Transaction },
  Pick<Issue, "fingerprint" | "id" | "createdAt"> | null
> {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  run(): void {
    it("should persist the issue to the database", async () => {
      const now = new Date().toISOString();
      const issueData = createCreateIssueData(now);
      const storage = await this.getStorage();
      const transaction = await storage.createTransaction();
      try {
        const id = await storage.createIssue(issueData, transaction);
        const testEnd = Date.now();

        const issue = await this.postProcessingFunc({ id, transaction });
        await transaction.rollbackAndEnd();

        if (!issue) throw new Error("No issue returned by postProcessingFunc");

        expect(issue.id.toString()).toBe(id);
        expect(issue.fingerprint).toBe(issueData.fingerprint);
        expect(new Date(issue.createdAt).getTime()).toBeGreaterThanOrEqual(
          new Date(now).getTime()
        );
        expect(new Date(issue.createdAt).getTime()).toBeLessThanOrEqual(
          testEnd
        );
      } catch (err) {
        if (!transaction.ended) await transaction.rollbackAndEnd();
        await storage.close();
        throw err;
      }

      await storage.close();
    });
  }
}
