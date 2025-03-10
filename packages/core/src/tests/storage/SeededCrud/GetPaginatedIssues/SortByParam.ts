import { StorageTest } from "src/tests/storage/StorageTest";
import { GetStorageFunc } from "src/tests/storage/types";
import { getStringDistance } from "src/tests/storage/utils";
import { GetPaginatedIssuesFilters } from "src/types";

export class SortByParam extends StorageTest {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  run(): void {
    it("should sort the issues by the provided sort param in the specified order", async () => {
      const storage = await this.getStorage();
      const filters: GetPaginatedIssuesFilters[] = [
        {
          searchString: "",
          page: 1,
          perPage: 10,
          tab: "unresolved",
          sort: "created-at",
          order: "desc",
        },
        {
          searchString: "",
          page: 1,
          perPage: 10,
          tab: "unresolved",
          sort: "created-at",
          order: "asc",
        },
        {
          searchString: "",
          page: 1,
          perPage: 10,
          tab: "unresolved",
          sort: "last-seen",
          order: "desc",
        },
        {
          searchString: "",
          page: 1,
          perPage: 10,
          tab: "unresolved",
          sort: "last-seen",
          order: "asc",
        },
        {
          searchString: "",
          page: 1,
          perPage: 10,
          tab: "unresolved",
          sort: "total-occurrences",
          order: "desc",
        },
        {
          searchString: "",
          page: 1,
          perPage: 10,
          tab: "unresolved",
          sort: "total-occurrences",
          order: "asc",
        },
        {
          searchString: "Error",
          page: 1,
          perPage: 10,
          tab: "unresolved",
          sort: "relevance",
          order: "desc",
        },
        {
          searchString: "nothing like",
          page: 1,
          perPage: 10,
          tab: "unresolved",
          sort: "relevance",
          order: "asc",
        },
      ];

      try {
        for (const filter of filters) {
          const issues = await storage.getPaginatedIssues(filter);

          if (filter.sort !== "relevance") {
            let field:
              | "createdAt"
              | "totalOccurrences"
              | "lastOccurrenceTimestamp" = "createdAt";

            switch (filter.sort) {
              case "created-at":
                field = "createdAt";
                break;
              case "last-seen":
                field = "lastOccurrenceTimestamp";
                break;
              case "total-occurrences":
                field = "totalOccurrences";
                break;
              default:
                throw new Error("Invalid sort parameter");
            }

            for (let i = 0; i < issues.length - 1; i++) {
              if (i > issues.length - 2) break;
              if (filter.order === "desc") {
                expect(issues[i][field] >= issues[i + 1][field]).toBe(true);
              } else {
                expect(issues[i][field] <= issues[i + 1][field]).toBe(true);
              }
            }
          } else {
            for (let i = 0; i < issues.length - 1; i++) {
              if (i > issues.length - 2) break;
              if (filter.order === "desc") {
                expect(
                  getStringDistance(filter.searchString, issues[i].name) <=
                    getStringDistance(filter.searchString, issues[i + 1].name)
                ).toBe(true);
              } else {
                expect(
                  getStringDistance(filter.searchString, issues[i].name) >=
                    getStringDistance(filter.searchString, issues[i + 1].name)
                ).toBe(true);
              }
            }
          }
        }
      } catch (err) {
        await storage.close();
        throw err;
      }

      await storage.close();
    });
  }
}
