import { GetStorageFunc } from "dev/types";
import { StorageScenario } from "../StorageScenario";
import { ChangeReadyStateToFalse } from "./ChangeReadyStateToFalse";

export class Close extends StorageScenario {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  change_ready_state_to_false = new ChangeReadyStateToFalse(this.getTestObject);

  run() {
    describe("close", () => {
      this.callHooks();
      this.change_ready_state_to_false.run();
    });
  }
}
