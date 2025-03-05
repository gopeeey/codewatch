import { GetStorageFunc } from "dev/types";
import { Issue, Transaction } from "src/types";
import { StorageTest } from "../StorageTest";
import { createCreateIssueData } from "../utils";

export class PersistIssue extends StorageTest<
  void,
  void,
  { id: string; transaction: Transaction },
  Pick<Issue, "fingerprint" | "id" | "createdAt">
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
        const testStart = Date.now();
        const id = await storage.createIssue(issueData, transaction);
        const testEnd = Date.now();

        const issue = await this.postProcessingFunc({ id, transaction });
        await transaction.rollback();

        expect(issue.id.toString()).toBe(id);
        expect(issue.fingerprint).toBe(issueData.fingerprint);
        expect(new Date(issue.createdAt).getTime()).toBeGreaterThanOrEqual(
          testStart
        );
        expect(new Date(issue.createdAt).getTime()).toBeLessThanOrEqual(
          testEnd
        );
      } catch (err) {
        await transaction.rollbackAndEnd();
        await storage.close();
        throw err;
      }

      await transaction.end();
      await storage.close();
    });
  }
}
