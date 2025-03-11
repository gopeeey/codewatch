import { StorageScenario } from "src/storage/tester/storage_scenario";
import {
  GetStorageFunc,
  IsoFromNow,
  TestIssueData,
} from "src/storage/tester/types";
import { ApplyFilters } from "./apply_filters";
import { PaginateIssues } from "./paginate_issues";
import { SortByParam } from "./sort_by_param";

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
