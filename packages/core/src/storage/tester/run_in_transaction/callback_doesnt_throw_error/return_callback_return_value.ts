import { StorageTest } from "src/storage/tester/storage_test";
import { createCreateIssueData } from "src/storage/tester/utils";
import { Storage } from "src/types";

export class ReturnCallbackReturnValue extends StorageTest {
  constructor(storage: Storage) {
    super(storage);
  }

  protected runTest(): void {
    this.runJestTest("should return the callback return value", async () => {
      const storage = await this.getStorage();
      const issueData = createCreateIssueData(new Date().toISOString(), {
        resolved: false,
      });

      const id = await storage.runInTransaction(async (transaction) => {
        return await storage.createIssue(issueData, transaction);
      });

      expect(id).not.toBeUndefined();
      expect(id.length > 0).toBe(true);
    });
  }
}
