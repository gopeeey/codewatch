import { IsoFromNow } from "src/storage/tester/types";
import { Occurrence, Storage } from "src/types";
import { BaseOccurrencePaginationTest } from "./base_occurrence_pagination_test";

export class SortOccurrencesByTimestamp extends BaseOccurrencePaginationTest {
  constructor(
    storage: Storage,
    occurrenceCount: number,
    isoFromNow: IsoFromNow
  ) {
    super(storage, occurrenceCount, isoFromNow);
  }

  protected runTest(): void {
    this.runJestTest(
      "should sort the occurrences by timestamp in descending order",
      async () => {
        const storage = await this.getStorage();

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
      }
    );
  }
}
