import { StorageScenario } from "src/storage/tester/storage_scenario";
import { GetStorageFunc } from "src/storage/tester/types";
import { DeleteIssuesWithSuppliedIds } from "./delete_issues_with_supplied_ids";

export class DeleteIssues extends StorageScenario {
  /**
   * Seeder: Should return any 2 issues from the database
   *
   * Post-processor: Should return the issues with the specified IDs
   */
  delete_issues_with_supplied_ids: DeleteIssuesWithSuppliedIds;

  constructor(getStorage: GetStorageFunc) {
    super(getStorage);

    this.delete_issues_with_supplied_ids = new DeleteIssuesWithSuppliedIds(
      getStorage
    );
  }

  run() {
    describe("deleteIssues", () => {
      this.callHooks();
      this.delete_issues_with_supplied_ids.run();
    });
  }
}
