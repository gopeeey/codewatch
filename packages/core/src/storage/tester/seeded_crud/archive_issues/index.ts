import { StorageScenario } from "src/storage/tester/storage_scenario";
import { Storage } from "src/types";
import { UpdateArchivedToTrue } from "./update_archived_to_true";

export class ArchiveIssues extends StorageScenario {
  /**
   * Seeder: Should return any two issues where archived is false from the database.
   *
   * Post-processor: Should return the issues with the supplied IDs.
   */
  update_archived_to_true: UpdateArchivedToTrue;

  constructor(storage: Storage) {
    super(storage);

    this.update_archived_to_true = new UpdateArchivedToTrue(storage);
  }

  protected runScenario() {
    describe("archiveIssues", () => {
      this.callHooks();
      this.update_archived_to_true.run();
    });
  }
}
