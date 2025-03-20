import { IsoFromNow } from "src/storage/tester/types";
import { GetPaginatedOccurrencesFilters, Occurrence, Storage } from "src/types";
import { BaseOccurrencePaginationTest } from "./base_occurrence_pagination_test";

export class ApplySuppliedFilters extends BaseOccurrencePaginationTest {
  constructor(
    storage: Storage,
    occurrenceCount: number,
    isoFromNow: IsoFromNow
  ) {
    super(storage, occurrenceCount, isoFromNow);
  }

  protected runTest(): void {
    this.runJestTest("should apply the supplied filters", async () => {
      const testData: {
        filters: Omit<GetPaginatedOccurrencesFilters, "page" | "perPage">;
        expectedMsgs: Occurrence["message"][];
      }[] = [
        {
          filters: {
            issueId: this.issueId,
            startDate: this.isoFromNow(5000),
            endDate: this.isoFromNow(0),
          },
          expectedMsgs: ["Error 1", "Error 2", "Error 3", "Error 4", "Error 5"],
        },
        {
          filters: {
            issueId: this.issueId,
            startDate: this.isoFromNow(10000),
            endDate: this.isoFromNow(5000),
          },
          expectedMsgs: [
            "Error 5",
            "Error 6",
            "Error 7",
            "Error 8",
            "Error 9",
            "Error 10",
          ],
        },
        {
          filters: {
            issueId: this.issueId,
            startDate: this.isoFromNow((this.occurrenceCount + 2) * 1000),
            endDate: this.isoFromNow((this.occurrenceCount + 1) * 1000),
          },
          expectedMsgs: [],
        },
        {
          filters: {
            issueId: "0", // Issue doesn't exist
            startDate: this.isoFromNow((this.occurrenceCount + 1) * 1000),
            endDate: this.isoFromNow(0),
          },
          expectedMsgs: [],
        },
      ];

      const storage = await this.getStorage();

      for (const { filters, expectedMsgs } of testData) {
        const occurrences = await storage.getPaginatedOccurrences({
          ...filters,
          page: 1,
          perPage: this.occurrenceCount,
        });

        expect(occurrences.map(({ message }) => message)).toEqual(expectedMsgs);
      }
    });
  }
}
