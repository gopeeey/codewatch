import { StorageScenario } from "src/tests/storage/StorageScenario";
import { GetStorageFunc } from "src/tests/types";
import { ReturnIssue } from "./ReturnIssue";

export class IssueExists extends StorageScenario {
  /**
   * Seeder: Should return an issue with the given ID
   *
   * Post-processor: None
   */
  return_issue: ReturnIssue;

  constructor(getStorage: GetStorageFunc) {
    super(getStorage);

    this.return_issue = new ReturnIssue(getStorage);
  }

  run() {
    describe("given the issue exists", () => {
      this.callHooks();
      this.return_issue.run();
    });
  }
}
