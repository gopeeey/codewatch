import { StorageScenario } from "src/storage/tester/storage_scenario";
import { GetStorageFunc } from "src/storage/tester/types";
import { UpdateResolvedToFalse } from "./updated_resolved_to_false";

export class UnresolveIssues extends StorageScenario {
  /**
   * Seeder: Should return any two issues where resolved is true from the database.
   *
   * Post-processor: Should return the issues with the supplied IDs.
   */
  update_resolved_to_false: UpdateResolvedToFalse;

  constructor(getStorage: GetStorageFunc) {
    super(getStorage);

    this.update_resolved_to_false = new UpdateResolvedToFalse(getStorage);
  }

  run() {
    describe("unresolveIssues", () => {
      this.callHooks();
      this.update_resolved_to_false.run();
    });
  }
}
