import { StorageScenario } from "src/tests/storage/StorageScenario";
import { GetStorageFunc } from "src/tests/types";
import { IssueDoesntExist } from "./IssueDoesntExist";
import { IssueExists } from "./IssueExists";

export class FindIssueById extends StorageScenario {
  issue_exists: IssueExists;
  issue_doesnt_exist: IssueDoesntExist;

  constructor(getStorage: GetStorageFunc) {
    super(getStorage);

    this.issue_exists = new IssueExists(getStorage);
    this.issue_doesnt_exist = new IssueDoesntExist(getStorage);
  }

  run() {
    describe("findIssueById", () => {
      this.callHooks();
      this.issue_exists.run();
      this.issue_doesnt_exist.run();
    });
  }
}
