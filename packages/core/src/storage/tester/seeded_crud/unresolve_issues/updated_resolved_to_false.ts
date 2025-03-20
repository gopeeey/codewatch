import { StorageTest } from "src/storage/tester/storage_test";
import { Issue, Storage } from "src/types";

export class UpdateResolvedToFalse extends StorageTest<
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
      "should update resolved to false on the issues with the supplied ids",
      async () => {
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

          if (!issue.resolved) {
            throw new Error(
              "The value of 'resolved' in the issues returned by the seed function must be true"
            );
          }
        });

        const storage = await this.getStorage();

        const ids = issues.map(({ id }) => id);
        await storage.unresolveIssues(ids);
        const unresolvedIssues = await this.postProcessingFunc(ids);

        expect(unresolvedIssues.length).toBe(issues.length);
        for (const id of ids) {
          const issue = unresolvedIssues.find((issue) => issue.id === id);
          if (!issue) {
            throw new Error(
              "Issue with id " +
                id +
                " not found in unresolved issues returned by postProcessingFunc"
            );
          }

          expect(issue.resolved).toBe(false);
        }
      }
    );
  }
}
