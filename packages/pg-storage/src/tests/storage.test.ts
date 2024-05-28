import {
  GetIssuesFilters,
  GetPaginatedOccurrencesFilters,
  Issue,
  Occurrence,
  UpdateLastOccurrenceOnIssueType,
} from "@codewatch/types";
import SQL from "sql-template-strings";
import { CodewatchPgStorage } from "../storage";
import { DbIssue } from "../types";
import { CreateIssueData, createCreateIssueData, dbSetup } from "./utils";

const pool = dbSetup();

const getStorage = async (init = true) => {
  const storage = new CodewatchPgStorage({
    user: process.env.POSTGRES_DB_USERNAME,
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB_NAME,
    password: process.env.POSTGRES_DB_PASSWORD,
    port: Number(process.env.POSTGRES_DB_PORT),
  });
  if (init) await storage.init();
  return storage;
};

describe("init", () => {
  describe("given the migrations table does not exist", () => {
    it("should create the migrations table", async () => {
      await pool.query(
        SQL`DROP TABLE IF EXISTS codewatch_pg_migrations CASCADE;`
      );

      const storage = await getStorage(false);
      await storage.init();

      const { rows } = await pool.query(
        SQL`SELECT EXISTS (
                SELECT FROM pg_tables
                WHERE schemaname = 'public'
                AND tablename ='codewatch_pg_migrations'
            );`
      );

      expect(rows[0].exists).toBe(true);
      await storage.close();
    });
  });

  it("should run all migrations up", async () => {
    await pool.query(
      SQL`
      DROP TABLE IF EXISTS codewatch_pg_migrations CASCADE;
      DROP TABLE IF EXISTS codewatch_pg_issues CASCADE;`
    );
    const storage = await getStorage(false);
    await storage.init();

    const { rows } = await pool.query(
      SQL`SELECT tablename FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = ANY(${[
          "codewatch_pg_issues",
          "codewatch_pg_migrations",
        ]});`
    );

    const tablenames = rows.map(({ tablename }) => tablename as string);
    expect(tablenames).toContain("codewatch_pg_issues");
    await storage.close();
  });

  it("should change the storage ready state to true", async () => {
    const storage = await getStorage(false);
    expect(storage.ready).toBe(false);
    await storage.init();

    expect(storage.ready).toBe(true);
    await storage.close();
  });
});

describe("close", () => {
  it("should change the storage ready state to false", async () => {
    const storage = await getStorage();
    expect(storage.ready).toBe(true);
    await storage.close();
    expect(storage.ready).toBe(false);
  });
});

describe("createIssue", () => {
  it("should create a new error record", async () => {
    const now = new Date().toISOString();
    const issueData = createCreateIssueData(now);
    const storage = await getStorage();
    const id = await storage.createIssue(issueData);

    const { rows } = await pool.query<Pick<DbIssue, "fingerprint" | "id">>(
      SQL`SELECT fingerprint, id FROM codewatch_pg_issues;`
    );

    expect(rows[0].id.toString()).toBe(id);
    expect(rows[0].fingerprint).toBe(issueData.fingerprint);
    await storage.close();
  });
});

describe("addOccurrence", () => {
  it("should create a new occurrence record", async () => {
    const now = new Date().toISOString();
    const issueData = createCreateIssueData(now);
    const storage = await getStorage();
    const issueId = await storage.createIssue(issueData);

    const data: Occurrence = {
      issueId,
      message: "Error 1",
      timestamp: now,
      stderrLogs: [
        { timestamp: 1234567, message: "something was logged here" },
      ],
      stdoutLogs: [
        { timestamp: 534564567, message: "something was logged here too" },
      ],
      extraData: { foo: "bar" },
      systemInfo: {
        appMemoryUsage: 1234,
        appUptime: 1234,
        deviceMemory: 1234,
        deviceUptime: 1234,
        freeMemory: 1234,
      },
    };
    await storage.addOccurrence(data);

    const { rows } = await pool.query<Occurrence>(
      SQL`
        SELECT * FROM codewatch_pg_occurrences
        WHERE "issueId" = ${issueId} 
        ORDER BY timestamp DESC;
      `
    );

    expect(rows).toHaveLength(1);
    rows[0].issueId = rows[0].issueId.toString();
    expect(rows[0]).toMatchObject(data);
    await storage.close();
  });
});

describe("updateLastOccurrenceOnError", () => {
  it("should update the last occurrence timestamp and increment total occurrences", async () => {
    const now = new Date().toISOString();
    const issueData = createCreateIssueData(now);
    const storage = await getStorage();
    const issueId = await storage.createIssue(issueData);

    const newStackString = "Something";

    const data: UpdateLastOccurrenceOnIssueType = {
      issueId,
      message: "Error 1",
      timestamp: now,
      stack: newStackString,
    };

    await storage.updateLastOccurrenceOnIssue(data);
    await storage.updateLastOccurrenceOnIssue(data);

    const { rows } = await pool.query<
      Pick<Issue, "totalOccurrences" | "lastOccurrenceTimestamp" | "stack">
    >(
      SQL`SELECT "totalOccurrences", "lastOccurrenceTimestamp", "stack" FROM codewatch_pg_issues;`
    );

    expect(rows[0].totalOccurrences).toBe(2);
    expect(rows[0].lastOccurrenceTimestamp).toBe(now);
    expect(rows[0].stack).toBe(newStackString);
    await storage.close();
  });
});

describe("findIssueIdByFingerprint", () => {
  describe("given an existing error record", () => {
    it("should return the id of the record", async () => {
      const now = new Date().toISOString();
      const issueData = createCreateIssueData(now);
      const storage = await getStorage();
      const issueId = await storage.createIssue(issueData);

      const id = await storage.findIssueIdByFingerprint(issueData.fingerprint);

      expect(id).toBe(issueId);
      await storage.close();
    });
  });

  describe("given a non-existing error record", () => {
    it("should return null", async () => {
      const fingerprint = "123456789012345678";

      const storage = await getStorage();
      const id = await storage.findIssueIdByFingerprint(fingerprint);

      expect(id).toBeNull();
      await storage.close();
    });
  });
});

const crudNow = Date.now();
const isoFromNow = (offset: number) => new Date(crudNow - offset).toISOString();
const issuesData: {
  timestamp: string;
  overrides?: Partial<CreateIssueData>;
}[] = [
  {
    timestamp: isoFromNow(25000),
    overrides: { name: "Nothing like the rest", fingerprint: "123" },
  },
  {
    timestamp: isoFromNow(20000),
    overrides: {
      fingerprint: "234",
      lastOccurrenceTimestamp: isoFromNow(5001),
    },
  },
  { timestamp: isoFromNow(15000), overrides: { fingerprint: "345" } },
  {
    timestamp: isoFromNow(10000),
    overrides: {
      name: "Error 2",
      fingerprint: "456",
      lastOccurrenceTimestamp: isoFromNow(2000),
    },
  },
  {
    timestamp: isoFromNow(5000),
    overrides: { name: "Error 3", fingerprint: "567" },
  },
  { timestamp: isoFromNow(0), overrides: { fingerprint: "678" } },
];

const seed = async () => {
  await Promise.all(
    issuesData.map(async ({ timestamp, overrides }) => {
      const issueData = createCreateIssueData(timestamp, overrides);
      const storage = await getStorage();
      await storage.createIssue(issueData);
      await storage.close();
    })
  );
};

describe("Seed required CRUD", () => {
  beforeEach(seed, 5000);
  describe("getPaginatedIssues", () => {
    it("should sort the issues by lastOccurrenceTimestamp in descending order", async () => {
      const storage = await getStorage();
      const issues = await storage.getPaginatedIssues({
        searchString: "",
        page: 1,
        perPage: 10,
        resolved: false,
      });

      let lastTimestamp = new Date().toISOString();
      for (const issue of issues) {
        expect(issue.lastOccurrenceTimestamp < lastTimestamp).toBe(true);
        lastTimestamp = issue.lastOccurrenceTimestamp;
      }
      expect.assertions(issuesData.length);
      await storage.close();
    });

    it("should paginate the issues", async () => {
      const testData: {
        page: number;
        perPage: number;
        expectedFPrint: string[];
      }[] = [
        { page: 1, perPage: 1, expectedFPrint: ["678"] },
        { page: 2, perPage: 1, expectedFPrint: ["456"] },
        { page: 1, perPage: 2, expectedFPrint: ["678", "456"] },
        { page: 2, perPage: 2, expectedFPrint: ["567", "234"] },
        { page: 2, perPage: 10, expectedFPrint: [] },
      ];

      const storage = await getStorage();
      for (const { page, perPage, expectedFPrint } of testData) {
        const issues = await storage.getPaginatedIssues({
          searchString: "",
          page,
          perPage,
          resolved: false,
        });

        expect(issues.map(({ fingerprint }) => fingerprint)).toEqual(
          expectedFPrint
        );
      }
      await storage.close();
    });

    it("should apply the supplied filters", async () => {
      const testData: {
        filters: GetIssuesFilters;
        expectedFPrints: Issue["fingerprint"][];
      }[] = [
        {
          filters: { searchString: "error", resolved: false },
          expectedFPrints: ["678", "456", "567", "234", "345"],
        },
        {
          filters: { searchString: "error 2", resolved: false },
          expectedFPrints: ["456"],
        },
        {
          filters: { searchString: "", resolved: false },
          expectedFPrints: ["678", "456", "567", "234", "345", "123"],
        },
        { filters: { searchString: "", resolved: true }, expectedFPrints: [] },
        {
          filters: {
            searchString: "",
            startDate: isoFromNow(10000),
            resolved: false,
          },
          expectedFPrints: ["678", "456", "567", "234"],
        },
        {
          filters: {
            searchString: "",
            endDate: isoFromNow(15000),
            resolved: false,
          },
          expectedFPrints: ["345", "123"],
        },
        {
          filters: {
            searchString: "",
            startDate: isoFromNow(25000),
            endDate: isoFromNow(10000),
            resolved: false,
          },
          expectedFPrints: ["345", "123"],
        },
        {
          filters: {
            searchString: "rest",
            startDate: isoFromNow(25000),
            endDate: isoFromNow(10000),
            resolved: false,
          },
          expectedFPrints: ["123"],
        },
      ];

      const storage = await getStorage();
      for (const { filters, expectedFPrints } of testData) {
        const issues = await storage.getPaginatedIssues({
          ...filters,
          page: 1,
          perPage: 10,
        });

        expect(issues.map(({ fingerprint }) => fingerprint)).toEqual(
          expectedFPrints
        );
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
          filters: { searchString: "error", resolved: false },
          expectedTotal: 5,
        },
        {
          filters: { searchString: "error 2", resolved: false },
          expectedTotal: 1,
        },
        {
          filters: { searchString: "", resolved: false },
          expectedTotal: 6,
        },
        { filters: { searchString: "", resolved: true }, expectedTotal: 0 },
        {
          filters: {
            searchString: "",
            startDate: isoFromNow(10000),
            resolved: false,
          },
          expectedTotal: 4,
        },
        {
          filters: {
            searchString: "",
            endDate: isoFromNow(15000),
            resolved: false,
          },
          expectedTotal: 2,
        },
        {
          filters: {
            searchString: "",
            startDate: isoFromNow(25000),
            endDate: isoFromNow(10000),
            resolved: false,
          },
          expectedTotal: 2,
        },
        {
          filters: {
            searchString: "rest",
            startDate: isoFromNow(25000),
            endDate: isoFromNow(10000),
            resolved: false,
          },
          expectedTotal: 1,
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

  describe("findIssueById", () => {
    describe("given the issue exists", () => {
      it("should return the issue with the supplied id", async () => {
        const { rows: issues } = await pool.query<DbIssue>(
          SQL`SELECT * FROM codewatch_pg_issues LIMIT 1;`
        );
        expect(issues.length).toBe(1);
        const storage = await getStorage();
        const expected = issues[0];
        const issue = await storage.findIssueById(expected.id.toString());
        expect(issue).toEqual({ ...expected, id: expected.id.toString() });
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
      });
    }

    const seedOccurrences = async () => {
      const { rows: issues } = await pool.query<DbIssue>(
        SQL`SELECT * FROM codewatch_pg_issues;`
      );

      if (!issues.length)
        throw new Error("No issues found when seeding occurrences");
      const issueId = issues[0].id;

      const query = SQL`INSERT INTO codewatch_pg_occurrences ("issueId", message, "stderrLogs", "stdoutLogs", timestamp) VALUES `;
      for (let i = 0; i < occurrenceData.length; i++) {
        const occurrence = occurrenceData[i];
        query.append(
          SQL`(${issueId}, ${occurrence.message}, ${occurrence.stderrLogs}, ${occurrence.stdoutLogs}, ${occurrence.timestamp})`
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
});
