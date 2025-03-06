import { GetStorageFunc } from "src/tests/types";
import { Occurrence, Transaction } from "src/types";
import { StorageTest } from "../StorageTest";
import { createCreateIssueData } from "../utils";

export class CreateNewOccurrence extends StorageTest<
  void,
  void,
  { issueId: string; transaction: Transaction },
  Occurrence | null
> {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  run(): void {
    it("should create a new occurrence record", async () => {
      const now = new Date().toISOString();
      const issueData = createCreateIssueData(now);
      const storage = await this.getStorage();
      const transaction = await storage.createTransaction();
      try {
        const issueId = await storage.createIssue(issueData, transaction);

        const data: Occurrence = {
          issueId,
          message: "Error 1",
          timestamp: now,
          stderrLogs: [
            { timestamp: 1234567, message: "something was logged here" },
          ],
          stdoutLogs: [
            { timestamp: 534564567, message: "something was logged here too" },
          ],
          stack: "error location",
          extraData: { foo: "bar" },
          systemInfo: {
            appMemoryUsage: 1234,
            appUptime: 1234,
            deviceMemory: 1234,
            deviceUptime: 1234,
            freeMemory: 1234,
          },
          context: [["foo", "bar"]],
        };
        await storage.addOccurrence(data, transaction);

        const occurrence = await this.postProcessingFunc({
          issueId,
          transaction,
        });

        await transaction.rollbackAndEnd();
        await storage.close();

        if (!occurrence) {
          throw new Error("No occurrence returned from postProcessingFunc");
        }
        occurrence.issueId = occurrence.issueId.toString();
        expect(occurrence).toMatchObject(data);
      } catch (err) {
        if (!transaction.ended) await transaction.rollbackAndEnd();
        await storage.close();
        throw err;
      }
    });
  }
}
