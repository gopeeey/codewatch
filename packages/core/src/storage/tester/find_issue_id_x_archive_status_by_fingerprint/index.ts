import { Storage } from "src/types";
import { StorageScenario } from "../storage_scenario";
import { IssueDoesntExist } from "./issue_doesnt_exist";
import { IssueExists } from "./issue_exists";

export class FindIssueIdxArchiveStatusByFingerprint extends StorageScenario {
  issue_exists: IssueExists;
  issue_doesnt_exist: IssueDoesntExist;

  constructor(storage: Storage) {
    super(storage);

    this.issue_exists = new IssueExists(storage);
    this.issue_doesnt_exist = new IssueDoesntExist(storage);
  }

  protected runScenario() {
    describe("findIssueIdxArchiveStatusByFingerprint", () => {
      this.callHooks();
      this.issue_exists.run();
      this.issue_doesnt_exist.run();
    });
  }
}
