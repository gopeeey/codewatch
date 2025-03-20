import { StorageScenario } from "src/storage/tester/storage_scenario";
import { IsoFromNow, TestIssueData } from "src/storage/tester/types";
import { Storage } from "src/types";
import { ReturnExpectedStatsData } from "./return_expected_stats_data";

export class GetStatsData extends StorageScenario {
  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  return_expected_stats_data: ReturnExpectedStatsData;

  constructor(
    storage: Storage,
    issuesData: TestIssueData[],
    isoFromNow: IsoFromNow
  ) {
    super(storage);

    this.return_expected_stats_data = new ReturnExpectedStatsData(
      storage,
      issuesData,
      isoFromNow
    );
  }

  protected runScenario() {
    describe("getStatsData", () => {
      this.callHooks();
      this.return_expected_stats_data.run();
    });
  }
}
