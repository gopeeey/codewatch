import { GetStorageFunc } from "src/tests/storage/types";
import { StorageScenario } from "../StorageScenario";
import { IssueDoesntExist } from "./IssueDoesntExist";
import { IssueExists } from "./IssueExists";

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
