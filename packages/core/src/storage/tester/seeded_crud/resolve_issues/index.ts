import { StorageScenario } from "src/storage/tester/storage_scenario";
import { GetStorageFunc } from "src/storage/tester/types";
import { UpdateResolvedToTrue } from "./update_resolved_to_true";

export class ResolveIssues extends StorageScenario {
  /**
   * Seeder: Should return any two issues where resolved is false from the database.
   *
   * Post-processor: Should return the issues with the supplied IDs.
   */
  update_resolved_to_true: UpdateResolvedToTrue;

  constructor(getStorage: GetStorageFunc) {
    super(getStorage);

    this.update_resolved_to_true = new UpdateResolvedToTrue(getStorage);
  }

  run() {
    describe("resolveIssues", () => {
      this.callHooks();
      this.update_resolved_to_true.run();
    });
  }
}
