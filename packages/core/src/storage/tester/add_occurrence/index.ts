import { Storage } from "src/types";
import { StorageScenario } from "../storage_scenario";
import { CreateNewOccurrence } from "./create_new_occurrence";

export class AddOccurrence extends StorageScenario {
  /**
   * Seeder: None
   *
   * Post-processor: should return an occurrence with the given issueId
   */
  create_new_occurrence: CreateNewOccurrence;
  constructor(storage: Storage) {
    super(storage);

    this.create_new_occurrence = new CreateNewOccurrence(storage);
  }

  protected runScenario() {
    describe("addOccurrence", () => {
      this.callHooks();
      this.create_new_occurrence.run();
    });
  }
}
