import { StorageScenario } from "src/storage/tester/storage_scenario";
import { Storage } from "src/types";
import { UpdateResolvedToFalse } from "./updated_resolved_to_false";

export class UnresolveIssues extends StorageScenario {
  /**
   * Seeder: Should return any two issues where resolved is true from the database.
   *
   * Post-processor: Should return the issues with the supplied IDs.
   */
  update_resolved_to_false: UpdateResolvedToFalse;

  constructor(storage: Storage) {
    super(storage);

    this.update_resolved_to_false = new UpdateResolvedToFalse(storage);
  }

  protected runScenario() {
    describe("unresolveIssues", () => {
      this.callHooks();
      this.update_resolved_to_false.run();
    });
  }
}
