import { GetStorageFunc } from "src/tests/types";
import { StorageScenario } from "../StorageScenario";
import { CreateNewOccurrence } from "./CreateNewOccurrence";

export class AddOccurrence extends StorageScenario {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  /**
   * Seeder: None
   *
   * Post-processor: should return an occurrence with the given issueId
   */
  create_new_occurrence = new CreateNewOccurrence(this.getTestObject);

  run() {
    describe("addOccurrence", () => {
      this.callHooks();
      this.create_new_occurrence.run();
    });
  }
}
