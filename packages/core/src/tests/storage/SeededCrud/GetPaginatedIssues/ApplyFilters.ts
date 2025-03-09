import { StorageTest } from "src/tests/storage/StorageTest";
import { IsoFromNow, TestIssueData } from "src/tests/storage/types";
import {
  archivedFilter,
  fPrintSortFn,
  nameFilter,
  resolvedFilter,
  timeFilter,
  unresolvedFilter,
} from "src/tests/storage/utils";
import { GetStorageFunc } from "src/tests/types";
import { GetIssuesFilters, Issue } from "src/types";

export class ApplyFilters extends StorageTest {
  private issuesData: TestIssueData[];
  private isoFromNow: IsoFromNow;

  constructor(
    getStorage: GetStorageFunc,
    issuesData: TestIssueData[],
    isoFromNow: IsoFromNow
  ) {
    super(getStorage);
    this.issuesData = issuesData;
    this.isoFromNow = isoFromNow;
  }

  run(): void {
    it("should apply the supplied filters", async () => {
      const testData: {
        filters: GetIssuesFilters;
        expectedFPrints: Issue["fingerprint"][];
      }[] = [
        {
          filters: { searchString: "error", tab: "unresolved" },
          expectedFPrints: this.issuesData
            .filter(
              (data) =>
                nameFilter(data, "error", true) && unresolvedFilter(data)
            )
            .map((data) => data.overrides?.fingerprint as string),
        },
        {
          filters: { searchString: "error 2", tab: "unresolved" }, // Not exact similarity, would also match stuff like "Error 1", "Error..."
          expectedFPrints: this.issuesData
            .filter(
              (data) =>
                nameFilter(data, "error", true) && unresolvedFilter(data)
            )
            .map((data) => data.overrides?.fingerprint as string),
        },
        {
          filters: { searchString: "", tab: "unresolved" },
          expectedFPrints: this.issuesData
            .filter(unresolvedFilter)
            .map((data) => data.overrides?.fingerprint as string),
        },
        {
          filters: { searchString: "", tab: "resolved" },
          expectedFPrints: this.issuesData
            .filter(resolvedFilter)
            .map((data) => data.overrides?.fingerprint as string),
        },
        {
          filters: { searchString: "", tab: "archived" },
          expectedFPrints: this.issuesData
            .filter(archivedFilter)
            .map((data) => data.overrides?.fingerprint as string),
        },
        {
          filters: {
            searchString: "",
            startDate: this.isoFromNow(10000),
            tab: "unresolved",
          },
          expectedFPrints: this.issuesData
            .filter(
              (data) =>
                timeFilter(data, this.isoFromNow, 10000) &&
                unresolvedFilter(data)
            )
            .map((data) => data.overrides?.fingerprint as string),
        },
        {
          filters: {
            searchString: "",
            endDate: this.isoFromNow(15000),
            tab: "unresolved",
          },
          expectedFPrints: this.issuesData
            .filter(
              (data) =>
                timeFilter(data, this.isoFromNow, undefined, 15000) &&
                unresolvedFilter(data)
            )
            .map((data) => data.overrides?.fingerprint as string),
        },
        {
          filters: {
            searchString: "",
            startDate: this.isoFromNow(25000),
            endDate: this.isoFromNow(10000),
            tab: "unresolved",
          },
          expectedFPrints: this.issuesData
            .filter(
              (data) =>
                timeFilter(data, this.isoFromNow, 25000, 10000) &&
                unresolvedFilter(data)
            )
            .map((data) => data.overrides?.fingerprint as string),
        },
        {
          filters: {
            searchString: "nothing",
            startDate: this.isoFromNow(25000),
            endDate: this.isoFromNow(10000),
            tab: "unresolved",
          },
          expectedFPrints: this.issuesData
            .filter(
              (data) =>
                timeFilter(data, this.isoFromNow, 25000, 10000) &&
                unresolvedFilter(data) &&
                nameFilter(data, "nothing")
            )
            .map((data) => data.overrides?.fingerprint as string),
        },
      ];
      const storage = await this.getStorage();

      try {
        for (const { filters, expectedFPrints } of testData) {
          const issues = await storage.getPaginatedIssues({
            ...filters,
            page: 1,
            perPage: 10,
            sort: "created-at",
            order: "desc",
          });

          expect(
            issues.map(({ fingerprint }) => fingerprint).sort(fPrintSortFn)
          ).toEqual(expectedFPrints.sort(fPrintSortFn));
        }
      } catch (err) {
        await storage.close();
        throw err;
      }

      await storage.close();
    });
  }
}
