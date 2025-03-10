import { GetStorageFunc, IsoFromNow } from "src/tests/storage/types";
import { Occurrence } from "src/types";
import { BaseOccurrencePaginationTest } from "./BaseOccurrencePaginationTest";

export class SortOccurrencesByTimestamp extends BaseOccurrencePaginationTest {
  constructor(
    getStorage: GetStorageFunc,
    occurrenceCount: number,
    isoFromNow: IsoFromNow
  ) {
    super(getStorage, occurrenceCount, isoFromNow);
  }

  run(): void {
    it("should sort the occurrences by timestamp in descending order", async () => {
      const storage = await this.getStorage();
      try {
        const occurrences = await storage.getPaginatedOccurrences({
          issueId: this.issueId,
          page: 1,
          perPage: this.occurrenceCount,
          startDate: this.isoFromNow((this.occurrenceCount + 1) * 1000),
          endDate: this.isoFromNow(0),
        });

        let lastTimestamp: Occurrence["timestamp"] | null = null;
        for (const occurrence of occurrences) {
          if (lastTimestamp == null) {
            lastTimestamp = occurrence.timestamp;
            continue;
          }
          expect(occurrence.timestamp < lastTimestamp).toBe(true);
          lastTimestamp = occurrence.timestamp;
        }
        expect.assertions(this.occurrenceCount - 1);
      } catch (err) {
        await storage.close();
        throw err;
      }

      await storage.close();
    });
  }
}
