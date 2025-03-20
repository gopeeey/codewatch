import { Storage } from "src/types";
import { StorageScenario } from "../storage_scenario";
import { ChangeReadyStateToFalse } from "./change_ready_state_to_false";

export class Close extends StorageScenario {
  /**
   * Seeder: Should return a fresh uninitialized storage instance
   *
   * Post-processor: None
   */
  change_ready_state_to_false: ChangeReadyStateToFalse;

  constructor(storage: Storage) {
    super(storage);

    this.change_ready_state_to_false = new ChangeReadyStateToFalse(storage);
  }

  protected runScenario() {
    describe("close", () => {
      this.callHooks();
      this.change_ready_state_to_false.run();
    });
  }
}
