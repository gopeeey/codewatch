import { GetStorageFunc } from "src/storage/tester/types";
import { StorageScenario } from "../storage_scenario";
import { IssueDoesntExist } from "./issue_doesnt_exist";
import { IssueExists } from "./issue_exists";

export class FindIssueIdxArchiveStatusByFingerprint extends StorageScenario {
  issue_exists: IssueExists;
  issue_doesnt_exist: IssueDoesntExist;

  constructor(getStorage: GetStorageFunc) {
    super(getStorage);

    this.issue_exists = new IssueExists(getStorage);
    this.issue_doesnt_exist = new IssueDoesntExist(getStorage);
  }

  run() {
    describe("findIssueIdxArchiveStatusByFingerprint", () => {
      this.callHooks();
      this.issue_exists.run();
      this.issue_doesnt_exist.run();
    });
  }
}
