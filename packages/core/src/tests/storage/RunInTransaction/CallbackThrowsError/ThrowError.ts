import { StorageTest } from "src/tests/storage/StorageTest";
import { GetStorageFunc } from "src/tests/storage/types";
import { createCreateIssueData } from "src/tests/storage/utils";

export class ThrowError extends StorageTest {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  run(): void {
    it("should throw the error", async () => {
      const err = new Error("Hello there");
      const fingerprint = "somethingspecial";
      const storage = await this.getStorage();

      expect(async () => {
        await storage.runInTransaction(async (transaction) => {
          const issueData = createCreateIssueData(new Date().toISOString(), {
            fingerprint,
          });
          await storage.createIssue(issueData, transaction);

          throw err;
        });
      }).rejects.toThrow(err);

      await storage.close();
    });
  }
}
