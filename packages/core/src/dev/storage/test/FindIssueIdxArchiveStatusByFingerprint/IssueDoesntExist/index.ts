import { StorageScenario } from "dev/storage/test/StorageScenario";
import { GetStorageFunc } from "dev/types";
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
