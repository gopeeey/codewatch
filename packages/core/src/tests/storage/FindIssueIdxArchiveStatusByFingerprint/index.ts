import { GetStorageFunc } from "src/tests/types";
import { StorageScenario } from "../StorageScenario";
import { IssueDoesntExist } from "./IssueDoesntExist";
import { IssueExists } from "./IssueExists";

export class FindIssueIdxArchiveStatusByFingerprint extends StorageScenario {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  issue_exists = new IssueExists(this.getTestObject);
  issue_doesnt_exist = new IssueDoesntExist(this.getTestObject);

  run() {
    describe("findIssueIdxArchiveStatusByFingerprint", () => {
      this.callHooks();
      this.issue_exists.run();
      this.issue_doesnt_exist.run();
    });
  }
}
