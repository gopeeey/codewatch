import { StorageScenario } from "src/tests/storage/StorageScenario";
import { GetStorageFunc } from "src/tests/types";
import { ReturnIssueId } from "./ReturnIssueId";

export class IssueExists extends StorageScenario {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  return_issue_id = new ReturnIssueId(this.getTestObject);

  run() {
    describe("given the issue exists", () => {
      this.callHooks();
      this.return_issue_id.run();
    });
  }
}
