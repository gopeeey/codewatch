import { StorageTest } from "src/tests/storage/StorageTest";
import { GetStorageFunc } from "src/tests/storage/types";
import { createCreateIssueData } from "src/tests/storage/utils";
import { Transaction } from "src/types";

export class EndTransaction extends StorageTest {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  run(): void {
    it("should end the transaction", async () => {
      const storage = await this.getStorage();
      const issueData = createCreateIssueData(new Date().toISOString(), {
        resolved: false,
      });
      let trx: Transaction | undefined = undefined;

      try {
        await storage.runInTransaction(async (transaction) => {
          trx = transaction;
          return storage.createIssue(issueData, transaction);
        });
        await storage.close();

        if (!trx) throw new Error("No transaction passed");
        expect((trx as Transaction).ended).toBe(true);
      } catch (err) {
        await storage.close();
        throw err;
      }
    });
  }
}
