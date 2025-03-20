import { StorageTest } from "src/storage/tester/storage_test";
import { createCreateIssueData } from "src/storage/tester/utils";
import { Storage, Transaction } from "src/types";

export class EndTransaction extends StorageTest {
  constructor(storage: Storage) {
    super(storage);
  }

  protected runTest(): void {
    this.runJestTest("should end the transaction", async () => {
      const storage = await this.getStorage();
      const issueData = createCreateIssueData(new Date().toISOString(), {
        resolved: false,
      });
      let trx: Transaction | undefined = undefined;

      await storage.runInTransaction(async (transaction) => {
        trx = transaction;
        return storage.createIssue(issueData, transaction);
      });

      if (!trx) throw new Error("No transaction passed");
      expect((trx as Transaction).ended).toBe(true);
    });
  }
}
