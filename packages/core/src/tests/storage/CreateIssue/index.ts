import { GetStorageFunc } from "src/tests/storage/types";
import { StorageScenario } from "../StorageScenario";
import { PersistIssue } from "./PersistIssue";

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
