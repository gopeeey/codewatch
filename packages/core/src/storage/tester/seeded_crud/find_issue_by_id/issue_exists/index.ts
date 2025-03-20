import { StorageScenario } from "src/storage/tester/storage_scenario";
import { Storage } from "src/types";
import { ReturnIssue } from "./return_issue";

export class IssueExists extends StorageScenario {
  /**
   * Seeder: Should return an issue with the given ID
   *
   * Post-processor: None
   */
  return_issue: ReturnIssue;

  constructor(storage: Storage) {
    super(storage);

    this.return_issue = new ReturnIssue(storage);
  }

  protected runScenario() {
    describe("given the issue exists", () => {
      this.callHooks();
      this.return_issue.run();
    });
  }
}
