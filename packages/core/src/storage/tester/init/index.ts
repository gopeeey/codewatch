import { GetStorageFunc } from "src/storage/tester/types";
import { StorageScenario } from "../storage_scenario";
import { ChangeReadyStateToTrue } from "./change_ready_state_to_true";

export class Init extends StorageScenario {
  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  change_ready_state_to_true: ChangeReadyStateToTrue;

  constructor(getStorage: GetStorageFunc) {
    super(getStorage);

    this.change_ready_state_to_true = new ChangeReadyStateToTrue(getStorage);
  }

  run() {
    describe("init", () => {
      this.callHooks();
      this.change_ready_state_to_true.run();
    });
  }
}
