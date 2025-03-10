import { StorageScenario } from "src/tests/storage/StorageScenario";
import { GetStorageFunc } from "src/tests/storage/types";
import { UpdateResolvedToFalse } from "./UpdateResolvedToFalse";

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
