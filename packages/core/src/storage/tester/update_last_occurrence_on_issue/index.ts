import { GetStorageFunc } from "src/storage/tester/types";
import { StorageScenario } from "../storage_scenario";
import { UpdateIssue } from "./update_issue";

export class UpdateLastOccurrenceOnIssue extends StorageScenario {
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
  update_issue: UpdateIssue;

  constructor(getStorage: GetStorageFunc) {
    super(getStorage);

    this.update_issue = new UpdateIssue(getStorage);
  }

  run() {
    describe("updateLastOccurrenceOnIssue", () => {
      this.callHooks();
      this.update_issue.run();
    });
  }
}
