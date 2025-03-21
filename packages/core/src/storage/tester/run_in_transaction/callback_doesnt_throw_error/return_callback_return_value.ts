import { StorageTest } from "src/storage/tester/storage_test";
import { GetStorageFunc } from "src/storage/tester/types";
import { createCreateIssueData } from "src/storage/tester/utils";

export class ReturnCallbackReturnValue extends StorageTest {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  run(): void {
    it("should return the callback return value", async () => {
      const storage = await this.getStorage();
      const issueData = createCreateIssueData(new Date().toISOString(), {
        resolved: false,
      });

      const id = await storage.runInTransaction(async (transaction) => {
        return await storage.createIssue(issueData, transaction);
      });
      await storage.close();

      expect(id).not.toBeUndefined();
      expect(id.length > 0).toBe(true);
    });
  }
}
