import { GetStorageFunc } from "src/tests/types";
import { StorageScenario } from "../StorageScenario";
import { ChangeReadyStateToTrue } from "./ChangeReadyStateToTrue";

export class Init extends StorageScenario {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  change_ready_state_to_true = new ChangeReadyStateToTrue(this.getTestObject);

  run() {
    describe("init", () => {
      this.callHooks();
      this.change_ready_state_to_true.run();
    });
  }
}
