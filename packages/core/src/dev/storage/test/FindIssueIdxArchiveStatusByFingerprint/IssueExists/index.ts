import { StorageScenario } from "dev/storage/test/StorageScenario";
import { GetStorageFunc } from "dev/types";
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
