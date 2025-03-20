import { StorageScenario } from "src/storage/tester/storage_scenario";
import { Storage } from "src/types";
import { UpdateResolvedToTrue } from "./update_resolved_to_true";

export class ResolveIssues extends StorageScenario {
  /**
   * Seeder: Should return any two issues where resolved is false from the database.
   *
   * Post-processor: Should return the issues with the supplied IDs.
   */
  update_resolved_to_true: UpdateResolvedToTrue;

  constructor(storage: Storage) {
    super(storage);

    this.update_resolved_to_true = new UpdateResolvedToTrue(storage);
  }

  protected runScenario() {
    describe("resolveIssues", () => {
      this.callHooks();
      this.update_resolved_to_true.run();
    });
  }
}
