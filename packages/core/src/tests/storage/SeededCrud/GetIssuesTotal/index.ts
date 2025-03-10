import { StorageScenario } from "src/tests/storage/StorageScenario";
import { GetStorageFunc } from "src/tests/storage/types";
import { IsoFromNow, TestIssueData } from "../../types";
import { ReturnTotalForAppliedFilters } from "./ReturnTotalForAppliedFilters";

export class GetIssuesTotal extends StorageScenario {
  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  return_total_for_applied_filters: ReturnTotalForAppliedFilters;

  constructor(
    getStorage: GetStorageFunc,
    issuesData: TestIssueData[],
    isoFromNow: IsoFromNow
  ) {
    super(getStorage);
    this.return_total_for_applied_filters = new ReturnTotalForAppliedFilters(
      getStorage,
      issuesData,
      isoFromNow
    );
  }

  run() {
    describe("getIssuesTotal", () => {
      this.callHooks();
      this.return_total_for_applied_filters.run();
    });
  }
}
