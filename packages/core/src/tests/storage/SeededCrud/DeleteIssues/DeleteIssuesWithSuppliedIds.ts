import { StorageTest } from "src/tests/storage/StorageTest";
import { GetStorageFunc } from "src/tests/storage/types";
import { Issue } from "src/types";

export class DeleteIssuesWithSuppliedIds extends StorageTest<
  void,
  Issue[],
  Issue["id"][],
  Issue[]
> {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  run(): void {
    it("should delete the issues with the supplied ids", async () => {
      const issues = await this.seedFunc();
      if (issues.length < 2) {
        throw new Error(
          "The seed function should return any 2 issues from the database"
        );
      }
      const storage = await this.getStorage();

      try {
        const ids = issues.map(({ id }) => id);
        await storage.deleteIssues(ids);
        const deletedIssues = await this.postProcessingFunc(ids);
        expect(deletedIssues.length).toBe(0);
      } catch (err) {
        await storage.close();
        throw err;
      }

      await storage.close();
    });
  }
}
