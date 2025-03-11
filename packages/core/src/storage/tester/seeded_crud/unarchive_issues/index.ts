import { StorageScenario } from "src/storage/tester/storage_scenario";
import { GetStorageFunc } from "src/storage/tester/types";
import { UpdateArchivedToFalse } from "./update_archived_to_false";

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
