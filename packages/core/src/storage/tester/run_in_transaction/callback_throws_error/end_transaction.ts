import { StorageTest } from "src/storage/tester/storage_test";
import { createCreateIssueData } from "src/storage/tester/utils";
import { Storage, Transaction } from "src/types";

export class EndTransaction extends StorageTest {
  constructor(storage: Storage) {
    super(storage);
  }

  protected runTest(): void {
    this.runJestTest("should end the transaction", async () => {
      const err = new Error("Hello there");
      const fingerprint = "somethingspecial";
      const storage = await this.getStorage();
      let trx: Transaction | undefined = undefined;

      try {
        await storage.runInTransaction(async (transaction) => {
          trx = transaction;
          const issueData = createCreateIssueData(new Date().toISOString(), {
            fingerprint,
          });
          await storage.createIssue(issueData, transaction);
          throw err;
        });
      } catch (err) {
        if (!trx) throw new Error("No transaction passed");
        expect((trx as Transaction).ended).toBe(true);
      }

      expect.assertions(1);
    });
  }
}
