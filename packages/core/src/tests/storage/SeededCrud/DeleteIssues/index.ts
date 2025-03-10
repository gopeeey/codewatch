import { StorageScenario } from "src/tests/storage/StorageScenario";
import { GetStorageFunc } from "src/tests/storage/types";
import { DeleteIssuesWithSuppliedIds } from "./DeleteIssuesWithSuppliedIds";

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
