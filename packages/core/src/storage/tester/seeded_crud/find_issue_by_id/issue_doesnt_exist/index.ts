import { StorageScenario } from "src/storage/tester/storage_scenario";
import { GetStorageFunc } from "src/storage/tester/types";
import { ReturnNull } from "./return_null";

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
