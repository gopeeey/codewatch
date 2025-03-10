import { StorageScenario } from "src/tests/storage/StorageScenario";
import { GetStorageFunc } from "src/tests/storage/types";
import { ReturnIssueId } from "./ReturnIssueId";

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
