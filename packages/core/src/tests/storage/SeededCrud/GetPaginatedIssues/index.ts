import { StorageScenario } from "src/tests/storage/StorageScenario";
import { IsoFromNow, TestIssueData } from "src/tests/storage/types";
import { GetStorageFunc } from "src/tests/types";
import { ApplyFilters } from "./ApplyFilters";
import { PaginateIssues } from "./PaginateIssues";
import { SortByParam } from "./SortByParam";

export class GetPaginatedIssues extends StorageScenario {
  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  sort_by_param: SortByParam;

  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  paginate_issues: PaginateIssues;

  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  apply_filters: ApplyFilters;

  constructor(
    getStorage: GetStorageFunc,
    issuesData: TestIssueData[],
    isoFromNow: IsoFromNow
  ) {
    super(getStorage);

    this.sort_by_param = new SortByParam(getStorage);
    this.paginate_issues = new PaginateIssues(getStorage);
    this.apply_filters = new ApplyFilters(getStorage, issuesData, isoFromNow);
  }

  run() {
    describe("getPaginatedIssues", () => {
      this.callHooks();
      this.sort_by_param.run();
      this.paginate_issues.run();
      this.apply_filters.run();
    });
  }
}
