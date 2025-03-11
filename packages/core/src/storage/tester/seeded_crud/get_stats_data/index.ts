import { StorageScenario } from "src/storage/tester/storage_scenario";
import {
  GetStorageFunc,
  IsoFromNow,
  TestIssueData,
} from "src/storage/tester/types";
import { ReturnExpectedStatsData } from "./return_expected_stats_data";

export class GetStatsData extends StorageScenario {
  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  return_expected_stats_data: ReturnExpectedStatsData;

  constructor(
    getStorage: GetStorageFunc,
    issuesData: TestIssueData[],
    isoFromNow: IsoFromNow
  ) {
    super(getStorage);

    this.return_expected_stats_data = new ReturnExpectedStatsData(
      getStorage,
      issuesData,
      isoFromNow
    );
  }

  run() {
    describe("getStatsData", () => {
      this.callHooks();
      this.return_expected_stats_data.run();
    });
  }
}
