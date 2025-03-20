import { Storage } from "src/types";
import { StorageScenario } from "../storage_scenario";
import { PersistIssue } from "./persist_issue";

export class CreateIssue extends StorageScenario {
  /**
   * Seeder: None
   *
   * Post-processor: should return the issue with the specified ID
   */
  persist_issue: PersistIssue;

  constructor(storage: Storage) {
    super(storage);

    this.persist_issue = new PersistIssue(storage);
  }

  protected runScenario() {
    describe("createIssue", () => {
      this.callHooks();
      this.persist_issue.run();
    });
  }
}
