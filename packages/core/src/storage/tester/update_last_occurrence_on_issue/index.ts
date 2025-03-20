import { Storage } from "src/types";
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

  constructor(storage: Storage) {
    super(storage);

    this.update_issue = new UpdateIssue(storage);
  }

  protected runScenario() {
    describe("updateLastOccurrenceOnIssue", () => {
      this.callHooks();
      this.update_issue.run();
    });
  }
}
