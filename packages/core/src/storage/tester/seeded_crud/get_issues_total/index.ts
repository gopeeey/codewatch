import { StorageScenario } from "src/storage/tester/storage_scenario";
import { Storage } from "src/types";
import { IsoFromNow, TestIssueData } from "../../types";
import { ReturnTotalForAppliedFilters } from "./return_total_for_applied_filters";

export class GetIssuesTotal extends StorageScenario {
  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  return_total_for_applied_filters: ReturnTotalForAppliedFilters;

  constructor(
    private storage: Storage,
    issuesData: TestIssueData[],
    isoFromNow: IsoFromNow
  ) {
    super(storage);
    this.return_total_for_applied_filters = new ReturnTotalForAppliedFilters(
      storage,
      issuesData,
      isoFromNow
    );
  }

  protected runScenario() {
    describe("getIssuesTotal", () => {
      this.callHooks();
      this.return_total_for_applied_filters.run();
    });
  }
}
