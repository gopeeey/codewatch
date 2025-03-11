import { GetStorageFunc } from "src/storage/tester/types";
import { StorageScenario } from "../storage_scenario";
import { CreateNewOccurrence } from "./create_new_occurrence";

export class AddOccurrence extends StorageScenario {
  /**
   * Seeder: None
   *
   * Post-processor: should return an occurrence with the given issueId
   */
  create_new_occurrence: CreateNewOccurrence;
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);

    this.create_new_occurrence = new CreateNewOccurrence(getStorage);
  }

  run() {
    describe("addOccurrence", () => {
      this.callHooks();
      this.create_new_occurrence.run();
    });
  }
}
