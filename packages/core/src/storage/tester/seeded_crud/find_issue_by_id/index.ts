import { StorageScenario } from "src/storage/tester/storage_scenario";
import { GetStorageFunc } from "src/storage/tester/types";
import { IssueDoesntExist } from "./issue_doesnt_exist";
import { IssueExists } from "./issue_exists";

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
