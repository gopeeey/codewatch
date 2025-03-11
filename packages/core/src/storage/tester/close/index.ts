import { GetStorageFunc } from "src/storage/tester/types";
import { StorageScenario } from "../storage_scenario";
import { ChangeReadyStateToFalse } from "./change_ready_state_to_false";

export class Close extends StorageScenario {
  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  change_ready_state_to_false: ChangeReadyStateToFalse;

  constructor(getStorage: GetStorageFunc) {
    super(getStorage);

    this.change_ready_state_to_false = new ChangeReadyStateToFalse(getStorage);
  }

  run() {
    describe("close", () => {
      this.callHooks();
      this.change_ready_state_to_false.run();
    });
  }
}
