import {
  Issue,
  Storage,
  Transaction,
  UpdateLastOccurrenceOnIssueType,
} from "src/types";
import { StorageTest } from "../storage_test";
import { createCreateIssueData } from "../utils";

export class UpdateIssue extends StorageTest<
  void,
  void,
  { issueId: string; transaction: Transaction },
  Pick<
    Issue,
    | "totalOccurrences"
    | "lastOccurrenceTimestamp"
    | "lastOccurrenceMessage"
    | "resolved"
  >
> {
  constructor(storage: Storage) {
    super(storage);
  }

  protected runTest(): void {
    this.runJestTest(
      "should update the last occurrence timestamp, increment total occurrences and update resolved",
      async () => {
        const now = new Date().toISOString();
        const issueData = createCreateIssueData(now);
        const storage = await this.getStorage();
        const transaction = await storage.createTransaction();
        try {
          const issueId = await storage.createIssue(issueData, transaction);

          const updates: Omit<UpdateLastOccurrenceOnIssueType, "issueId">[] = [
            {
              message: "Error 1",
              timestamp: now,
              resolved: false,
            },
            {
              message: "Error 2",
              timestamp: now,
              resolved: true,
            },
          ];

          for (let i = 0; i < updates.length; i++) {
            const update = updates[i];
            await storage.updateLastOccurrenceOnIssue(
              {
                issueId,
                ...update,
              },
              transaction
            );

            const updatedIssue = await this.postProcessingFunc({
              issueId,
              transaction,
            });
            await transaction.commit();

            expect(updatedIssue.totalOccurrences).toBe(i + 2);
            expect(updatedIssue.lastOccurrenceTimestamp).toBe(update.timestamp);
            expect(updatedIssue.resolved).toBe(update.resolved);
            expect(updatedIssue.lastOccurrenceMessage).toBe(update.message);
          }
          await transaction.end();
        } catch (err) {
          await transaction.rollbackAndEnd();
          throw err;
        }
      }
    );
  }
}
