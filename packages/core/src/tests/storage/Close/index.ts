import { GetStorageFunc } from "src/tests/storage/types";
import { StorageScenario } from "../StorageScenario";
import { ChangeReadyStateToFalse } from "./ChangeReadyStateToFalse";

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
