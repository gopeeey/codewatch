import { StorageTest } from "src/tests/storage/StorageTest";
import { GetStorageFunc } from "src/tests/storage/types";
import { Issue } from "src/types";

export class UpdateResolvedToTrue extends StorageTest<
  void,
  Issue[],
  Issue["id"][],
  Issue[]
> {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  run(): void {
    it("should update resolved to true on the issues with the supplied ids", async () => {
      const issues = await this.seedFunc();
      if (issues.length < 2)
        throw new Error(
          "Seed function should return two issues from the database"
        );
      issues.forEach((issue) => {
        if (typeof issue.resolved !== "boolean") {
          throw new Error(
            "The value of 'resolved' in the issues returned by the seed function must be a boolean"
          );
        }

        if (issue.resolved) {
          throw new Error(
            "The value of 'resolved' in the issues returned by the seed function must be false"
          );
        }
      });

      const storage = await this.getStorage();

      try {
        const ids = issues.map(({ id }) => id);
        await storage.resolveIssues(ids);
        const resolvedIssues = await this.postProcessingFunc(ids);

        expect(resolvedIssues.length).toBe(issues.length);
        for (const id of ids) {
          const issue = resolvedIssues.find((issue) => issue.id === id);
          if (!issue) {
            throw new Error(
              "Issue with id " +
                id +
                " not found in resolved issues returned by postProcessingFunc"
            );
          }

          expect(issue.resolved).toBe(true);
        }
      } catch (err) {
        await storage.close();
        throw err;
      }

      await storage.close();
    });
  }
}
