import { StorageScenario } from "src/tests/storage/StorageScenario";
import {
  GetStorageFunc,
  IsoFromNow,
  TestIssueData,
} from "src/tests/storage/types";
import { ReturnExpectedStatsData } from "./ReturnExpectedStatsData";

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
