import { StorageScenario } from "src/tests/storage/StorageScenario";
import { GetStorageFunc } from "src/tests/types";
import { ReturnNull } from "./ReturnNull";

export class IssueDoesntExist extends StorageScenario {
  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  return_null: ReturnNull;

  constructor(getStorage: GetStorageFunc) {
    super(getStorage);

    this.return_null = new ReturnNull(getStorage);
  }

  run() {
    describe("given the issue doesn't exist", () => {
      this.callHooks();
      this.return_null.run();
    });
  }
}
