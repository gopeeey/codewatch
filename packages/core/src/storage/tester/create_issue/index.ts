import { GetStorageFunc } from "src/storage/tester/types";
import { StorageScenario } from "../storage_scenario";
import { PersistIssue } from "./persist_issue";

export class CreateIssue extends StorageScenario {
  /**
   * Seeder: None
   *
   * Post-processor: should return the issue with the specified ID
   */
  persist_issue: PersistIssue;

  constructor(getStorage: GetStorageFunc) {
    super(getStorage);

    this.persist_issue = new PersistIssue(getStorage);
  }

  run() {
    describe("createIssue", () => {
      this.callHooks();
      this.persist_issue.run();
    });
  }
}
