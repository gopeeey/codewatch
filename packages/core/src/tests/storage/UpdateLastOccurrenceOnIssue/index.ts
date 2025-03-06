import { GetStorageFunc } from "src/tests/types";
import { StorageScenario } from "../StorageScenario";
import { UpdateIssue } from "./UpdateIssue";

export class UpdateLastOccurrenceOnIssue extends StorageScenario {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  /**
   * Seeder: None
   *
   * Post-processor: should return an issue with the given issueId. The issue should
   * contain the updated values for the following fields:
   * - totalOccurrences
   * - lastOccurrenceTimestamp
   * - lastOccurrenceMessage
   * - resolved
   */
  update_issue = new UpdateIssue(this.getTestObject);

  run() {
    describe("updateLastOccurrenceOnIssue", () => {
      this.callHooks();
      this.update_issue.run();
    });
  }
}
