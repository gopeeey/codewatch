import { StorageScenario } from "src/storage/tester/storage_scenario";
import { GetStorageFunc } from "src/storage/tester/types";
import { ReturnIssue } from "./return_issue";

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
