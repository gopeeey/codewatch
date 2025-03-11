import { StorageScenario } from "src/storage/tester/storage_scenario";
import { GetStorageFunc } from "src/storage/tester/types";
import { ReturnIssueId } from "./return_issue_id";

export class IssueExists extends StorageScenario {
  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  return_issue_id: ReturnIssueId;

  constructor(getStorage: GetStorageFunc) {
    super(getStorage);

    this.return_issue_id = new ReturnIssueId(getStorage);
  }

  run() {
    describe("given the issue exists", () => {
      this.callHooks();
      this.return_issue_id.run();
    });
  }
}
