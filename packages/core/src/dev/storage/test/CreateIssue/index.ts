import { GetStorageFunc } from "dev/types";
import { StorageScenario } from "../StorageScenario";
import { PersistIssue } from "./PersistIssue";

export class CreateIssue extends StorageScenario {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  /**
   * Seeder: None
   *
   * Post-processor: should return the issue with the specified ID
   */
  persist_issue = new PersistIssue(this.getTestObject);

  run() {
    describe("createIssue", () => {
      this.callHooks();
      this.persist_issue.run();
    });
  }
}
