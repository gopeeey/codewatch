import { StorageScenario } from "src/storage/tester/storage_scenario";
import { Storage } from "src/types";
import { ReturnNull } from "./return_null";

export class IssueDoesntExist extends StorageScenario {
  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  return_null: ReturnNull;

  constructor(storage: Storage) {
    super(storage);

    this.return_null = new ReturnNull(storage);
  }

  protected runScenario() {
    describe("given the issue doesn't exist", () => {
      this.callHooks();
      this.return_null.run();
    });
  }
}
