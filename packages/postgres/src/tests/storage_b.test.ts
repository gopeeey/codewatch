import {
  GetIssuesFilters,
  GetPaginatedIssuesFilters,
  GetPaginatedOccurrencesFilters,
  GetStats,
  Issue,
  Occurrence,
  StatsData,
} from "codewatch-core/dist/types";
import SQL from "sql-template-strings";
import { PgTransaction } from "../storage";
import { DbIssue } from "../types";
import {
  CreateIssueData,
  createCreateIssueData,
  dbSetup,
  getStorage,
  getStringDistance,
  insertTestIssue,
  withinDateRange,
} from "./utils";

const pool = dbSetup();

const crudNow = Date.now();
const isoFromNow = (offset: number) => new Date(crudNow - offset).toISOString();
type TestIssueData = {
  timestamp: string;
  overrides?: Partial<CreateIssueData>;
};
const issuesData: TestIssueData[] = [
  {
    timestamp: isoFromNow(24 * 60 * 60 * 1000),
    overrides: {
      name: "Past one",
      fingerprint: "098",
    },
  },
  {
    timestamp: isoFromNow(35000),
    overrides: {
      name: "Error 123",
      fingerprint: "890",
      archived: true,
      unhandled: true,
    },
  },
  {
    timestamp: isoFromNow(30000),
    overrides: {
      name: "Error 2",
      fingerprint: "789",
      resolved: true,
      totalOccurrences: 30,
    },
  },
  {
    timestamp: isoFromNow(25000),
    overrides: {
      name: "Nothing like the rest",
      fingerprint: "123",
      isLog: true,
    },
  },
  {
    timestamp: isoFromNow(20000),
    overrides: {
      name: "Special error",
      fingerprint: "234",
      lastOccurrenceTimestamp: isoFromNow(6001),
      unhandled: true,
      totalOccurrences: 2,
    },
  },
  { timestamp: isoFromNow(15000), overrides: { fingerprint: "345" } },
  {
    timestamp: isoFromNow(10000),
    overrides: {
      name: "Error 2",
      fingerprint: "456",
      lastOccurrenceTimestamp: isoFromNow(2000),
      totalOccurrences: 2,
      unhandled: true,
    },
  },
  {
    timestamp: isoFromNow(5000),
    overrides: { name: "Error 3", fingerprint: "567", totalOccurrences: 14 },
  },
  {
    timestamp: isoFromNow(0),
    overrides: { fingerprint: "678", unhandled: true, totalOccurrences: 21 },
  },
];

const seed = async () => {
  const storage = await getStorage(); // Just to initialize the storage (create tables if they don't exist)
  await Promise.all(
    issuesData.map(async ({ timestamp, overrides }) => {
      const issueData = createCreateIssueData(timestamp, overrides);
      await insertTestIssue(pool, issueData);
    })
  );
  await storage.close();
};

const timeFilter = (
  data: TestIssueData,
  startTime?: number,
  endTime?: number
) => {
  if (!startTime && !endTime) return true;
  if (!startTime && endTime) return data.timestamp <= isoFromNow(endTime);
  if (startTime && !endTime) return data.timestamp >= isoFromNow(startTime);

  return withinDateRange(
    data.timestamp,
    isoFromNow(startTime as number),
    isoFromNow(endTime as number)
  );
};

const unresolvedFilter = (data: TestIssueData) => {
  return (
    (data.overrides && !data.overrides.resolved && !data.overrides.archived) ||
    !data.overrides
  );
};

const resolvedFilter = (data: TestIssueData) => {
  return data.overrides && data.overrides.resolved && !data.overrides.archived;
};

const archivedFilter = (data: TestIssueData) => {
  return data.overrides && data.overrides.archived;
};

const nameFilter = (
  data: TestIssueData,
  searchString: string,
  defaultName?: boolean
) => {
  if (defaultName) {
    return (
      (data.overrides &&
        data.overrides.name &&
        data.overrides.name
          .toLowerCase()
          .includes(searchString.toLowerCase())) ||
      !data.overrides?.name
    );
  }
  return (
    data.overrides &&
    data.overrides.name &&
    data.overrides.name.toLowerCase().includes(searchString.toLowerCase())
  );
};

describe("Seed required CRUD", () => {
  beforeEach(seed, 5000);
  const fPrintSortFn = (a: string, b: string) => Number(a) - Number(b);
  describe("getPaginatedIssues", () => {
    it("should sort the issues by the provided sort param in the specified order", async () => {
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
      const storage = await getStorage();

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

      await storage.close();
    });

    it("should paginate the issues", async () => {
      const testData: {
        page: number;
        perPage: number;
        expectedFPrint: string[];
      }[] = [
        { page: 1, perPage: 1, expectedFPrint: ["678"] },
        { page: 2, perPage: 1, expectedFPrint: ["567"] },
        { page: 1, perPage: 2, expectedFPrint: ["678", "567"] },
        { page: 2, perPage: 2, expectedFPrint: ["456", "345"] },
        { page: 2, perPage: 10, expectedFPrint: [] },
      ];

      const storage = await getStorage();
      for (const { page, perPage, expectedFPrint } of testData) {
        const issues = await storage.getPaginatedIssues({
          searchString: "",
          page,
          perPage,
          tab: "unresolved",
          sort: "created-at",
          order: "desc",
        });

        expect(
          issues.map(({ fingerprint }) => fingerprint).sort(fPrintSortFn)
        ).toEqual(expectedFPrint.sort(fPrintSortFn));
      }
      await storage.close();
    });

    it("should apply the supplied filters", async () => {
      const testData: {
        filters: GetIssuesFilters;
        expectedFPrints: Issue["fingerprint"][];
      }[] = [
        {
          filters: { searchString: "error", tab: "unresolved" },
          expectedFPrints: issuesData
            .filter(
              (data) =>
                nameFilter(data, "error", true) && unresolvedFilter(data)
            )
            .map((data) => data.overrides?.fingerprint as string),
        },
        {
          filters: { searchString: "error 2", tab: "unresolved" }, // Not exact similarity, would also match stuff like "Error 1", "Error..."
          expectedFPrints: issuesData
            .filter(
              (data) =>
                nameFilter(data, "error", true) && unresolvedFilter(data)
            )
            .map((data) => data.overrides?.fingerprint as string),
        },
        {
          filters: { searchString: "", tab: "unresolved" },
          expectedFPrints: issuesData
            .filter(unresolvedFilter)
            .map((data) => data.overrides?.fingerprint as string),
        },
        {
          filters: { searchString: "", tab: "resolved" },
          expectedFPrints: issuesData
            .filter(resolvedFilter)
            .map((data) => data.overrides?.fingerprint as string),
        },
        {
          filters: { searchString: "", tab: "archived" },
          expectedFPrints: issuesData
            .filter(archivedFilter)
            .map((data) => data.overrides?.fingerprint as string),
        },
        {
          filters: {
            searchString: "",
            startDate: isoFromNow(10000),
            tab: "unresolved",
          },
          expectedFPrints: issuesData
            .filter((data) => timeFilter(data, 10000) && unresolvedFilter(data))
            .map((data) => data.overrides?.fingerprint as string),
        },
        {
          filters: {
            searchString: "",
            endDate: isoFromNow(15000),
            tab: "unresolved",
          },
          expectedFPrints: issuesData
            .filter(
              (data) =>
                timeFilter(data, undefined, 15000) && unresolvedFilter(data)
            )
            .map((data) => data.overrides?.fingerprint as string),
        },
        {
          filters: {
            searchString: "",
            startDate: isoFromNow(25000),
            endDate: isoFromNow(10000),
            tab: "unresolved",
          },
          expectedFPrints: issuesData
            .filter(
              (data) => timeFilter(data, 25000, 10000) && unresolvedFilter(data)
            )
            .map((data) => data.overrides?.fingerprint as string),
        },
        {
          filters: {
            searchString: "nothing",
            startDate: isoFromNow(25000),
            endDate: isoFromNow(10000),
            tab: "unresolved",
          },
          expectedFPrints: issuesData
            .filter(
              (data) =>
                timeFilter(data, 25000, 10000) &&
                unresolvedFilter(data) &&
                nameFilter(data, "nothing")
            )
            .map((data) => data.overrides?.fingerprint as string),
        },
      ];

      const storage = await getStorage();
      for (const { filters, expectedFPrints } of testData) {
        const issues = await storage.getPaginatedIssues({
          ...filters,
          page: 1,
          perPage: 10,
          sort: "created-at",
          order: "desc",
        });

        expect(
          issues.map(({ fingerprint }) => fingerprint).sort(fPrintSortFn)
        ).toEqual(expectedFPrints.sort(fPrintSortFn));
      }
      await storage.close();
    });
  });

  describe("getIssuesTotal", () => {
    it("should return the total number of issues for the applied filters", async () => {
      const testData: {
        filters: GetIssuesFilters;
        expectedTotal: number;
      }[] = [
        {
          filters: { searchString: "error", tab: "unresolved" },
          expectedTotal: 5,
        },
        {
          filters: { searchString: "", tab: "unresolved" },
          expectedTotal: issuesData.filter(unresolvedFilter).length,
        },
        {
          filters: { searchString: "", tab: "resolved" },
          expectedTotal: issuesData.filter(resolvedFilter).length,
        },
        {
          filters: { searchString: "", tab: "archived" },
          expectedTotal: issuesData.filter(archivedFilter).length,
        },
        {
          filters: {
            searchString: "",
            startDate: isoFromNow(10000),
            tab: "unresolved",
          },
          expectedTotal: issuesData.filter(
            (data) => timeFilter(data, 10000) && unresolvedFilter(data)
          ).length,
        },
        {
          filters: {
            searchString: "",
            endDate: isoFromNow(15000),
            tab: "unresolved",
          },
          expectedTotal: issuesData.filter(
            (data) =>
              timeFilter(data, undefined, 15000) && unresolvedFilter(data)
          ).length,
        },
        {
          filters: {
            searchString: "",
            startDate: isoFromNow(25000),
            endDate: isoFromNow(10000),
            tab: "unresolved",
          },
          expectedTotal: issuesData.filter(
            (data) => timeFilter(data, 25000, 10000) && unresolvedFilter(data)
          ).length,
        },
        {
          filters: {
            searchString: "nothing like",
            startDate: isoFromNow(25000),
            endDate: isoFromNow(10000),
            tab: "unresolved",
          },
          expectedTotal: issuesData.filter(
            (data) =>
              timeFilter(data, 25000, 10000) &&
              data.overrides?.name?.toLowerCase().includes("nothing like") &&
              unresolvedFilter(data)
          ).length,
        },
      ];

      const storage = await getStorage();
      for (const { filters, expectedTotal } of testData) {
        const total = await storage.getIssuesTotal(filters);

        expect(total).toBe(expectedTotal);
      }
      await storage.close();
    });
  });

  describe("deleteIssues", () => {
    it("should delete the issues with the supplied ids", async () => {
      const { rows: issues } = await pool.query<Issue>(
        SQL`SELECT * FROM codewatch_pg_issues LIMIT 2;`
      );
      expect(issues.length).toBe(2);
      const storage = await getStorage();
      await storage.deleteIssues(issues.map(({ id }) => id.toString()));
      const { rows: deletedIssues } = await pool.query<Issue>(
        SQL`SELECT * FROM codewatch_pg_issues WHERE id = ANY(${issues.map(
          ({ id }) => id.toString()
        )});`
      );
      expect(deletedIssues.length).toBe(0);
      await storage.close();
    });
  });

  describe("resolveIssues", () => {
    it("should update resolved to true on the issues with the supplied ids", async () => {
      const { rows: issues } = await pool.query<Issue>(
        SQL`SELECT * FROM codewatch_pg_issues WHERE resolved = false LIMIT 2;`
      );
      expect(issues.length).toBe(2);
      const storage = await getStorage();
      await storage.resolveIssues(issues.map(({ id }) => id.toString()));
      const { rows: resolvedIssues } = await pool.query<Issue>(
        SQL`SELECT * FROM codewatch_pg_issues WHERE id = ANY(${issues.map(
          ({ id }) => id
        )});`
      );
      for (const { resolved } of resolvedIssues) {
        expect(resolved).toBe(true);
      }
      expect.assertions(resolvedIssues.length + 1); // Plus one for the initial assertion we did.
      await storage.close();
    });
  });

  describe("unresolveIssues", () => {
    it("should update resolved to false on the issues with the supplied ids", async () => {
      await pool.query(SQL`UPDATE codewatch_pg_issues SET resolved = true;`);
      const { rows: issues } = await pool.query<Issue>(
        SQL`SELECT * FROM codewatch_pg_issues WHERE resolved = true LIMIT 2;`
      );
      expect(issues.length).toBe(2);
      const storage = await getStorage();
      await storage.unresolveIssues(issues.map(({ id }) => id.toString()));
      const { rows: unresolvedIssues } = await pool.query<Issue>(
        SQL`SELECT * FROM codewatch_pg_issues WHERE id = ANY(${issues.map(
          ({ id }) => id
        )});`
      );
      for (const { resolved } of unresolvedIssues) {
        expect(resolved).toBe(false);
      }
      expect.assertions(unresolvedIssues.length + 1); // Plus one for the initial assertion we did.
      await storage.close();
    });
  });

  describe("archiveIssues", () => {
    it("should update archived to true on the issues with the supplied ids", async () => {
      const { rows: issues } = await pool.query<Issue>(
        SQL`SELECT * FROM codewatch_pg_issues WHERE archived = false LIMIT 2;`
      );
      expect(issues.length).toBe(2);
      const storage = await getStorage();
      await storage.archiveIssues(issues.map(({ id }) => id.toString()));
      const { rows: archivedIssues } = await pool.query<Issue>(
        SQL`SELECT * FROM codewatch_pg_issues WHERE id = ANY(${issues.map(
          ({ id }) => id
        )});`
      );
      for (const { archived } of archivedIssues) {
        expect(archived).toBe(true);
      }
      expect.assertions(archivedIssues.length + 1); // Plus one for the initial assertion we did.
      await storage.close();
    });
  });

  describe("unarchiveIssues", () => {
    it("should update archived to false on the issues with the supplied ids", async () => {
      await pool.query(SQL`UPDATE codewatch_pg_issues SET archived = true;`);
      const { rows: issues } = await pool.query<Issue>(
        SQL`SELECT * FROM codewatch_pg_issues WHERE archived = true LIMIT 2;`
      );
      expect(issues.length).toBe(2);
      const storage = await getStorage();
      await storage.unarchiveIssues(issues.map(({ id }) => id.toString()));
      const { rows: unarchivedIssues } = await pool.query<Issue>(
        SQL`SELECT * FROM codewatch_pg_issues WHERE id = ANY(${issues.map(
          ({ id }) => id
        )});`
      );
      for (const { archived } of unarchivedIssues) {
        expect(archived).toBe(false);
      }
      expect.assertions(unarchivedIssues.length + 1); // Plus one for the initial assertion we did.
      await storage.close();
    });
  });

  describe("findIssueById", () => {
    describe("given the issue exists", () => {
      it("should return the issue with the supplied id", async () => {
        const storage = await getStorage();
        const issueData = createCreateIssueData(issuesData[0].timestamp, {
          fingerprint: "somethingnew",
        });
        const transaction = await storage.createTransaction();
        const issueId = await storage.createIssue(issueData, transaction);

        const { rows: issues } = await (
          transaction as PgTransaction
        )._client.query<DbIssue>(
          SQL`SELECT * FROM codewatch_pg_issues WHERE id = ${issueId};`
        );
        expect(issues.length).toBe(1);

        const expected = issues[0];
        const issue = await storage.findIssueById(issueId, transaction);
        await transaction.rollbackAndEnd();
        expect(issue).toEqual({ ...expected, id: issueId });
        await storage.close();
      });
    });

    describe("given the issue doesn't exist", () => {
      it("should return null", async () => {
        const storage = await getStorage();
        const issue = await storage.findIssueById("0");
        expect(issue).toBeNull();
        await storage.close();
      });
    });
  });

  describe("getPaginatedOccurrences", () => {
    const occurrenceData: Omit<Occurrence, "issueId">[] = [];
    const occurrenceIssueId = "1";
    for (let i = 1; i < 11; i++) {
      occurrenceData.push({
        message: `Error ${i}`,
        stderrLogs: [],
        stdoutLogs: [],
        timestamp: isoFromNow(i * 1000),
        stack: i.toString(),
      });
    }

    const seedOccurrences = async () => {
      const { rows: issues } = await pool.query<DbIssue>(
        SQL`SELECT * FROM codewatch_pg_issues ORDER BY "id" ASC LIMIT 1;`
      );

      if (!issues.length)
        throw new Error("No issues found when seeding occurrences");

      const issueId = issues[0].id;

      const query = SQL`INSERT INTO codewatch_pg_occurrences ("issueId", message, "stderrLogs", "stdoutLogs", timestamp, stack) VALUES `;
      for (let i = 0; i < occurrenceData.length; i++) {
        const occurrence = occurrenceData[i];
        query.append(
          SQL`(${issueId}, ${occurrence.message}, ${occurrence.stderrLogs}, ${occurrence.stdoutLogs}, ${occurrence.timestamp}, ${occurrence.stack})`
        );
        if (i < occurrenceData.length - 1) query.append(", ");
      }
      query.append(SQL`;`);
      await pool.query(query);
    };

    beforeEach(seedOccurrences, 5000);
    it("should sort the occurrences by timestamp in descending order", async () => {
      const storage = await getStorage();
      const occurrences = await storage.getPaginatedOccurrences({
        issueId: occurrenceIssueId,
        page: 1,
        perPage: 10,
        startDate: isoFromNow(20000),
        endDate: isoFromNow(0),
      });

      let lastTimestamp = isoFromNow(0);
      for (const occurrence of occurrences) {
        expect(occurrence.timestamp < lastTimestamp).toBe(true);
        lastTimestamp = occurrence.timestamp;
      }
      expect.assertions(occurrenceData.length);
      await storage.close();
    });

    it("should paginate the occurrences", async () => {
      const testData: {
        page: number;
        perPage: number;
        expectedMsgs: Occurrence["message"][];
      }[] = [
        { page: 1, perPage: 1, expectedMsgs: ["Error 1"] },
        { page: 2, perPage: 1, expectedMsgs: ["Error 2"] },
        { page: 1, perPage: 2, expectedMsgs: ["Error 1", "Error 2"] },
        { page: 2, perPage: 2, expectedMsgs: ["Error 3", "Error 4"] },
        { page: 2, perPage: 10, expectedMsgs: [] },
      ];

      const storage = await getStorage();
      for (const { page, perPage, expectedMsgs } of testData) {
        const occurrences = await storage.getPaginatedOccurrences({
          issueId: occurrenceIssueId,
          page,
          perPage,
          startDate: isoFromNow(20000),
          endDate: isoFromNow(0),
        });

        expect(occurrences.map(({ message }) => message)).toEqual(expectedMsgs);
      }
      await storage.close();
    });

    it("should apply the supplied filters", async () => {
      const testData: {
        filters: Omit<GetPaginatedOccurrencesFilters, "page" | "perPage">;
        expectedMsgs: Occurrence["message"][];
      }[] = [
        {
          filters: {
            issueId: occurrenceIssueId,
            startDate: isoFromNow(5000),
            endDate: isoFromNow(0),
          },
          expectedMsgs: ["Error 1", "Error 2", "Error 3", "Error 4", "Error 5"],
        },
        {
          filters: {
            issueId: occurrenceIssueId,
            startDate: isoFromNow(10000),
            endDate: isoFromNow(5000),
          },
          expectedMsgs: [
            "Error 5",
            "Error 6",
            "Error 7",
            "Error 8",
            "Error 9",
            "Error 10",
          ],
        },
        {
          filters: {
            issueId: occurrenceIssueId,
            startDate: isoFromNow(30000),
            endDate: isoFromNow(20000),
          },
          expectedMsgs: [],
        },
        {
          filters: {
            issueId: "23456997",
            startDate: isoFromNow(30000),
            endDate: isoFromNow(0),
          },
          expectedMsgs: [],
        },
      ];

      const storage = await getStorage();
      for (const { filters, expectedMsgs } of testData) {
        const occurrences = await storage.getPaginatedOccurrences({
          ...filters,
          page: 1,
          perPage: 10,
        });

        expect(occurrences.map(({ message }) => message)).toEqual(expectedMsgs);
      }
      await storage.close();
    });
  });

  describe("getStatsData", () => {
    it("should return the expected stats data for the supplied filters", async () => {
      interface ModdedStatsData extends Omit<StatsData, "mostRecurringIssues"> {
        mostRecurringIssuesFprints: string[];
      }
      type TestCase = { filter: GetStats; expectedStats: ModdedStatsData };

      const createTestCase = (
        startTime: number,
        endTime: number,
        timezoneOffset: number = new Date().getTimezoneOffset()
      ): TestCase => {
        const dateFilterFn = (data: TestIssueData) => {
          const start = isoFromNow(startTime);
          const end = isoFromNow(endTime);
          if (data.overrides?.lastOccurrenceTimestamp) {
            if (
              withinDateRange(
                data.overrides.lastOccurrenceTimestamp,
                start,
                end
              )
            ) {
              return true;
            }
          }
          return withinDateRange(data.timestamp, start, end);
        };

        const getIncrement = (issueData: TestIssueData) => {
          if (
            issueData.overrides?.lastOccurrenceTimestamp &&
            issueData.overrides.totalOccurrences
          ) {
            // If last occurrence timestamp exists in overrides then total occurrences should as well.
            const lastWithin = withinDateRange(
              issueData.overrides.lastOccurrenceTimestamp,
              isoFromNow(startTime),
              isoFromNow(endTime)
            );
            const timestampWithin = withinDateRange(
              issueData.timestamp,
              isoFromNow(startTime),
              isoFromNow(endTime)
            );
            const both = lastWithin && timestampWithin;

            if (both) {
              return issueData.overrides.totalOccurrences;
            } else {
              if (lastWithin) return 1;
              if (timestampWithin)
                return issueData.overrides.totalOccurrences - 1;

              return 0;
            }
          } else {
            return issueData.overrides?.totalOccurrences ?? 1;
          }
        };

        const dailyOccurrenceCountReduceFn = (
          agg: StatsData["dailyOccurrenceCount"],
          data: TestIssueData
        ) => {
          const timestamp =
            data.overrides?.lastOccurrenceTimestamp || data.timestamp;
          // Format the timestamp for the current timezone and get the date part.
          const date = new Date(
            new Date(timestamp).getTime() - timezoneOffset * 60 * 1000
          );
          const dateStr = date.toISOString().split("T")[0];

          const existingIndex = agg.findIndex((item) => item.date === dateStr);
          if (existingIndex > -1) {
            agg[existingIndex].count += getIncrement(data);

            return agg;
          } else {
            return [...agg, { date: dateStr, count: getIncrement(data) }];
          }
        };

        const totalReduceFn = (agg: number, data: TestIssueData) => {
          return agg + getIncrement(data);
        };

        return {
          filter: {
            startDate: isoFromNow(startTime),
            endDate: isoFromNow(endTime),
            timezoneOffset,
          },

          expectedStats: {
            dailyOccurrenceCount: issuesData
              .filter(dateFilterFn)
              .reduce(
                dailyOccurrenceCountReduceFn,
                [] as StatsData["dailyOccurrenceCount"]
              ),

            dailyUnhandledOccurrenceCount: issuesData
              .filter(
                (data) =>
                  dateFilterFn(data) &&
                  data.overrides &&
                  data.overrides.unhandled
              )
              .reduce(
                dailyOccurrenceCountReduceFn,
                [] as StatsData["dailyOccurrenceCount"]
              ),

            mostRecurringIssuesFprints: issuesData
              .filter(dateFilterFn)
              .sort((a, b) => {
                // Sort by total occurrences in descending order
                const aCount = getIncrement(a);
                const bCount = getIncrement(b);
                const countDiff = bCount - aCount;
                if (countDiff !== 0) return countDiff;

                // and then by last occurrence timestamp in descending order (latest first)
                const aTime = new Date(
                  a.overrides?.lastOccurrenceTimestamp || a.timestamp
                ).getTime();
                const bTime = new Date(
                  b.overrides?.lastOccurrenceTimestamp || b.timestamp
                ).getTime();
                return bTime - aTime;
              })
              .slice(0, 5)
              .map(
                (data) => data.overrides?.fingerprint || "nothing_like_this"
              ),

            totalIssues: issuesData.filter(dateFilterFn).length,

            totalLoggedData: issuesData
              .filter(
                (data) =>
                  data.overrides && data.overrides.isLog && dateFilterFn(data)
              )
              .reduce(totalReduceFn, 0),
            totalManuallyCapturedOccurrences: issuesData
              .filter(
                (data) =>
                  dateFilterFn(data) &&
                  data.overrides &&
                  !data.overrides.unhandled &&
                  !data.overrides.isLog
              )
              .reduce(totalReduceFn, 0),
            totalOccurrences: issuesData
              .filter(dateFilterFn)
              .reduce(totalReduceFn, 0),
            totalUnhandledOccurrences: issuesData
              .filter(
                (data) =>
                  dateFilterFn(data) &&
                  data.overrides &&
                  data.overrides.unhandled
              )
              .reduce(totalReduceFn, 0),
          },
        };
      };

      let otherTimezone = new Date().getTimezoneOffset() + 120;
      if (otherTimezone > 60 * 13) otherTimezone = 0;

      const dataSet: TestCase[] = [
        createTestCase(10000, 0),
        createTestCase(25000, 5000),
        createTestCase(35000, 2000),
        createTestCase(15000, 10000),
        createTestCase(35000, 20000),

        createTestCase(10000, 0, otherTimezone),
        createTestCase(25000, 5000, otherTimezone),
        createTestCase(35000, 2000, otherTimezone),
        createTestCase(15000, 10000, otherTimezone),
        createTestCase(35000, 20000, otherTimezone),
      ];
      const storage = await getStorage();

      for (const testCase of dataSet) {
        const result = await storage.getStatsData(testCase.filter);
        const moddedResult: ModdedStatsData = {
          ...result,
          mostRecurringIssuesFprints: result.mostRecurringIssues.map(
            (issue) => issue.fingerprint
          ),
        };
        expect(moddedResult).toMatchObject(testCase.expectedStats);
      }
      await storage.close();
    });
  });
});
