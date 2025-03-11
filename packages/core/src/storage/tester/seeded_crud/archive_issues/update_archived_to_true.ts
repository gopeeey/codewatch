import { StorageTest } from "src/storage/tester/storage_test";
import { GetStorageFunc } from "src/storage/tester/types";
import { Issue } from "src/types";

export class UpdateArchivedToTrue extends StorageTest<
  void,
  Issue[],
  Issue["id"][],
  Issue[]
> {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  run(): void {
    it("should update archived to true on the issues with the supplied ids", async () => {
      const issues = await this.seedFunc();
      if (issues.length < 2)
        throw new Error(
          "Seed function should return two issues from the database"
        );
      issues.forEach((issue) => {
        if (typeof issue.archived !== "boolean") {
          throw new Error(
            "The value of 'archived' in the issues returned by the seed function must be a boolean"
          );
        }

        if (issue.archived) {
          throw new Error(
            "The value of 'archived' in the issues returned by the seed function must be false"
          );
        }
      });

      const storage = await this.getStorage();

      try {
        const ids = issues.map(({ id }) => id);
        await storage.archiveIssues(ids);
        const archivedIssues = await this.postProcessingFunc(ids);

        expect(archivedIssues.length).toBe(issues.length);
        for (const id of ids) {
          const issue = archivedIssues.find((issue) => issue.id === id);
          if (!issue) {
            throw new Error(
              "Issue with id " +
                id +
                " not found in archived issues returned by postProcessingFunc"
            );
          }

          expect(issue.archived).toBe(true);
        }
      } catch (err) {
        await storage.close();
        throw err;
      }

      await storage.close();
    });
  }
}
