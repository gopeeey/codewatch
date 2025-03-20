import { StorageTest } from "src/storage/tester/storage_test";
import { Issue, Storage } from "src/types";

export class DeleteIssuesWithSuppliedIds extends StorageTest<
  void,
  Issue[],
  Issue["id"][],
  Issue[]
> {
  constructor(storage: Storage) {
    super(storage);
  }

  protected runTest(): void {
    this.runJestTest(
      "should delete the issues with the supplied ids",
      async () => {
        const issues = await this.seedFunc();
        if (issues.length < 2) {
          throw new Error(
            "The seed function should return any 2 issues from the database"
          );
        }
        const storage = await this.getStorage();

        const ids = issues.map(({ id }) => id);
        await storage.deleteIssues(ids);
        const deletedIssues = await this.postProcessingFunc(ids);
        expect(deletedIssues.length).toBe(0);
      }
    );
  }
}
