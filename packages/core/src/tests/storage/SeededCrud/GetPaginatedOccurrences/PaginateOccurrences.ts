import { GetStorageFunc, IsoFromNow } from "src/tests/storage/types";
import { Occurrence } from "src/types";
import { BaseOccurrencePaginationTest } from "./BaseOccurrencePaginationTest";

export class PaginateOccurrences extends BaseOccurrencePaginationTest {
  constructor(
    getStorage: GetStorageFunc,
    occurrenceCount: number,
    isoFromNow: IsoFromNow
  ) {
    super(getStorage, occurrenceCount, isoFromNow);
  }

  run(): void {
    it("should paginate the occurrences", async () => {
      const testData: {
        page: number;
        perPage: number;
        expectedMsgs: Occurrence["message"][];
      }[] = [
        { page: 1, perPage: 1, expectedMsgs: ["Error 1"] },
        { page: 2, perPage: 1, expectedMsgs: ["Error 2"] },
        { page: 1, perPage: 2, expectedMsgs: ["Error 1", "Error 2"] },
        { page: 2, perPage: 2, expectedMsgs: ["Error 3", "Error 4"] },
        { page: 2, perPage: this.occurrenceCount, expectedMsgs: [] },
      ];

      const storage = await this.getStorage();
      try {
        for (const { page, perPage, expectedMsgs } of testData) {
          const occurrences = await storage.getPaginatedOccurrences({
            issueId: this.issueId,
            page,
            perPage,
            startDate: this.isoFromNow((this.occurrenceCount + 1) * 1000),
            endDate: this.isoFromNow(0),
          });

          expect(occurrences.map(({ message }) => message)).toEqual(
            expectedMsgs
          );
        }
      } catch (err) {
        await storage.close();
        throw err;
      }

      await storage.close();
    });
  }
}
