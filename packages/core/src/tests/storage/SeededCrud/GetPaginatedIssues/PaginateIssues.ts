import { StorageTest } from "src/tests/storage/StorageTest";
import { GetStorageFunc } from "src/tests/storage/types";
import { fPrintSortFn } from "src/tests/storage/utils";

export class PaginateIssues extends StorageTest {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  run(): void {
    it("should paginate the issues", async () => {
      const testData: {
        page: number;
        perPage: number;
        expectedFPrint: string[];
      }[] = [
        { page: 1, perPage: 1, expectedFPrint: ["678"] },
        { page: 2, perPage: 1, expectedFPrint: ["567"] },
        { page: 1, perPage: 2, expectedFPrint: ["678", "567"] },
        { page: 2, perPage: 2, expectedFPrint: ["456", "345"] },
        { page: 2, perPage: 10, expectedFPrint: [] },
      ];

      const storage = await this.getStorage();

      try {
        for (const { page, perPage, expectedFPrint } of testData) {
          const issues = await storage.getPaginatedIssues({
            searchString: "",
            page,
            perPage,
            tab: "unresolved",
            sort: "created-at",
            order: "desc",
          });

          expect(
            issues.map(({ fingerprint }) => fingerprint).sort(fPrintSortFn)
          ).toEqual(expectedFPrint.sort(fPrintSortFn));
        }
      } catch (err) {
        await storage.close();
        throw err;
      }

      await storage.close();
    });
  }
}
