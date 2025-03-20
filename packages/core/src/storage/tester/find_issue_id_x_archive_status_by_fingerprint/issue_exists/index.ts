import { StorageScenario } from "src/storage/tester/storage_scenario";
import { Storage } from "src/types";
import { ReturnIssueId } from "./return_issue_id";

export class IssueExists extends StorageScenario {
  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  return_issue_id: ReturnIssueId;

  constructor(storage: Storage) {
    super(storage);

    this.return_issue_id = new ReturnIssueId(storage);
  }

  protected runScenario() {
    describe("given the issue exists", () => {
      this.callHooks();
      this.return_issue_id.run();
    });
  }
}
