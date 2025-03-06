import { StorageScenario } from "src/tests/storage/StorageScenario";
import { GetStorageFunc } from "src/tests/types";
import { ReturnNull } from "./ReturnNull";

export class IssueDoesntExist extends StorageScenario {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  return_null = new ReturnNull(this.getTestObject);

  run() {
    describe("given the issue doesn't exist", () => {
      this.callHooks();
      this.return_null.run();
    });
  }
}
