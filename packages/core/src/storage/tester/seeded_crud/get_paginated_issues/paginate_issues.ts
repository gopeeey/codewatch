import { StorageTest } from "src/storage/tester/storage_test";
import { fPrintSortFn } from "src/storage/tester/utils";
import { Storage } from "src/types";

export class PaginateIssues extends StorageTest {
  constructor(storage: Storage) {
    super(storage);
  }

  protected runTest(): void {
    this.runJestTest("should paginate the issues", async () => {
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
    });
  }
}
