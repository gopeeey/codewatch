import { StorageScenario } from "src/tests/storage/StorageScenario";
import { GetStorageFunc } from "src/tests/types";
import { UpdateArchivedToFalse } from "./UpdateArchivedToFalse";

export class UnarchiveIssues extends StorageScenario {
  /**
   * Seeder: Should return any two issues where archived is true from the database.
   *
   * Post-processor: Should return the issues with the supplied IDs.
   */
  update_archived_to_false: UpdateArchivedToFalse;

  constructor(getStorage: GetStorageFunc) {
    super(getStorage);

    this.update_archived_to_false = new UpdateArchivedToFalse(getStorage);
  }

  run() {
    describe("unarchiveIssues", () => {
      this.callHooks();
      this.update_archived_to_false.run();
    });
  }
}
