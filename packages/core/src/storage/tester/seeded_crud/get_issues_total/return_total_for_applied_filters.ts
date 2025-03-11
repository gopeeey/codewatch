import { StorageTest } from "src/storage/tester/storage_test";
import { GetStorageFunc } from "src/storage/tester/types";
import {
  archivedFilter,
  resolvedFilter,
  timeFilter,
  unresolvedFilter,
} from "src/storage/tester/utils";
import { GetIssuesFilters } from "src/types";
import { IsoFromNow, TestIssueData } from "../../types";

export class ReturnTotalForAppliedFilters extends StorageTest {
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
    it("should return the total number of issues for the applied filters", async () => {
      const testData: {
        filters: GetIssuesFilters;
        expectedTotal: number;
      }[] = [
        {
          filters: { searchString: "error", tab: "unresolved" },
          expectedTotal: 5,
        },
        {
          filters: { searchString: "", tab: "unresolved" },
          expectedTotal: this.issuesData.filter(unresolvedFilter).length,
        },
        {
          filters: { searchString: "", tab: "resolved" },
          expectedTotal: this.issuesData.filter(resolvedFilter).length,
        },
        {
          filters: { searchString: "", tab: "archived" },
          expectedTotal: this.issuesData.filter(archivedFilter).length,
        },
        {
          filters: {
            searchString: "",
            startDate: this.isoFromNow(10000),
            tab: "unresolved",
          },
          expectedTotal: this.issuesData.filter(
            (data) =>
              timeFilter(data, this.isoFromNow, 10000) && unresolvedFilter(data)
          ).length,
        },
        {
          filters: {
            searchString: "",
            endDate: this.isoFromNow(15000),
            tab: "unresolved",
          },
          expectedTotal: this.issuesData.filter(
            (data) =>
              timeFilter(data, this.isoFromNow, undefined, 15000) &&
              unresolvedFilter(data)
          ).length,
        },
        {
          filters: {
            searchString: "",
            startDate: this.isoFromNow(25000),
            endDate: this.isoFromNow(10000),
            tab: "unresolved",
          },
          expectedTotal: this.issuesData.filter(
            (data) =>
              timeFilter(data, this.isoFromNow, 25000, 10000) &&
              unresolvedFilter(data)
          ).length,
        },
        {
          filters: {
            searchString: "nothing like",
            startDate: this.isoFromNow(25000),
            endDate: this.isoFromNow(10000),
            tab: "unresolved",
          },
          expectedTotal: this.issuesData.filter(
            (data) =>
              timeFilter(data, this.isoFromNow, 25000, 10000) &&
              data.overrides?.name?.toLowerCase().includes("nothing like") &&
              unresolvedFilter(data)
          ).length,
        },
      ];
      const storage = await this.getStorage();

      try {
        for (const { filters, expectedTotal } of testData) {
          const total = await storage.getIssuesTotal(filters);

          expect(total).toBe(expectedTotal);
        }
      } catch (err) {
        await storage.close();
        throw err;
      }

      await storage.close();
    });
  }
}
