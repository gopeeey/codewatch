import { Storage } from "src/types";
import { StorageScenario } from "../storage_scenario";
import { ChangeReadyStateToTrue } from "./change_ready_state_to_true";

export class Init extends StorageScenario {
  /**
   * Seeder: Should return a fresh uninitialized storage instance
   *
   * Post-processor: None
   */
  change_ready_state_to_true: ChangeReadyStateToTrue;

  constructor(storage: Storage) {
    super(storage);

    this.change_ready_state_to_true = new ChangeReadyStateToTrue(storage);
  }

  protected runScenario() {
    describe("init", () => {
      this.callHooks();
      this.change_ready_state_to_true.run();
    });
  }
}
