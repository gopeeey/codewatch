import { StorageScenario } from "src/tests/storage/StorageScenario";
import { GetStorageFunc } from "src/tests/types";
import { UpdateArchivedToTrue } from "./UpdateArchivedToTrue";

export class ArchiveIssues extends StorageScenario {
  /**
   * Seeder: Should return any two issues where archived is false from the database.
   *
   * Post-processor: Should return the issues with the supplied IDs.
   */
  update_archived_to_true: UpdateArchivedToTrue;

  constructor(getStorage: GetStorageFunc) {
    super(getStorage);

    this.update_archived_to_true = new UpdateArchivedToTrue(getStorage);
  }

  run() {
    describe("archiveIssues", () => {
      this.callHooks();
      this.update_archived_to_true.run();
    });
  }
}
