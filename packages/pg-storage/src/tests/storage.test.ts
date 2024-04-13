import { GetIssuesFilters, Issue, Occurrence } from "@codewatch/core";
import SQL from "sql-template-strings";
import { CodewatchPgStorage } from "../storage";
import { CreateIssueData, createCreateIssueData, dbSetup } from "./utils";

const pool = dbSetup();

const storage = new CodewatchPgStorage({
  user: process.env.POSTGRES_DB_USERNAME,
  host: process.env.POSTGRES_DB_HOST,
  database: process.env.POSTGRES_DB_NAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  port: Number(process.env.POSTGRES_DB_PORT),
});

afterAll(async () => {
  await storage.close();
}, 5000);

describe("init", () => {
  describe("given the migrations table does not exist", () => {
    it("should create the migrations table", async () => {
      await pool.query(
        SQL`DROP TABLE IF EXISTS codewatch_pg_migrations CASCADE;`
      );

      await storage.init();

      const { rows } = await pool.query(
        SQL`SELECT EXISTS (
                SELECT FROM pg_tables
                WHERE schemaname = 'public'
                AND tablename ='codewatch_pg_migrations'
            );`
      );

      expect(rows[0].exists).toBe(true);
    });
  });

  it("should run all migrations up", async () => {
    await pool.query(
      SQL`
      DROP TABLE IF EXISTS codewatch_pg_migrations CASCADE;
      DROP TABLE IF EXISTS codewatch_pg_issues CASCADE;`
    );

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
  });

  it("should change the storage ready state to true", async () => {
    await storage.init();

    expect(storage.ready).toBe(true);
  });
});

describe("createIssue", () => {
  it("should create a new error record", async () => {
    const now = new Date().toISOString();
    const issueData = createCreateIssueData(now);
    await storage.createIssue(issueData);

    const { rows } = await pool.query<Pick<Issue, "fingerprint">>(
      SQL`SELECT fingerprint FROM codewatch_pg_issues;`
    );

    expect(rows[0].fingerprint).toBe(issueData.fingerprint);
  });
});

describe("addOccurrence", () => {
  it("should create a new occurrence record", async () => {
    const now = new Date().toISOString();
    const issueData = createCreateIssueData(now);
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
    expect(rows[0]).toMatchObject(data);
  });
});

describe("updateLastOccurrenceOnError", () => {
  it("should update the last occurrence timestamp and increment total occurrences", async () => {
    const now = new Date().toISOString();
    const issueData = createCreateIssueData(now);
    const issueId = await storage.createIssue(issueData);

    const occurrence: Occurrence = {
      issueId,
      message: "Error 1",
      timestamp: now,
      stderrLogs: [
        { timestamp: 1234567, message: "something was logged here" },
      ],
      stdoutLogs: [
        { timestamp: 534564567, message: "something was logged here too" },
      ],
    };

    await storage.updateLastOccurrenceOnIssue(occurrence);
    await storage.updateLastOccurrenceOnIssue(occurrence);

    const { rows } = await pool.query<
      Pick<Issue, "totalOccurrences" | "lastOccurrenceTimestamp">
    >(
      SQL`SELECT "totalOccurrences", "lastOccurrenceTimestamp" FROM codewatch_pg_issues;`
    );

    expect(rows[0].totalOccurrences).toBe(2);
    expect(rows[0].lastOccurrenceTimestamp).toBe(now);
  });
});

describe("findIssueIdByFingerprint", () => {
  describe("given an existing error record", () => {
    it("should return the id of the record", async () => {
      const now = new Date().toISOString();
      const issueData = createCreateIssueData(now);
      const issueId = await storage.createIssue(issueData);

      const id = await storage.findIssueIdByFingerprint(issueData.fingerprint);

      expect(id).toBe(issueId);
    });
  });

  describe("given a non-existing error record", () => {
    it("should return null", async () => {
      const fingerprint = "123456789012345678";

      const id = await storage.findIssueIdByFingerprint(fingerprint);

      expect(id).toBeNull();
    });
  });
});

describe("getPaginatedIssues", () => {
  const now = Date.now();
  const isoFromNow = (offset: number) => new Date(now - offset).toISOString();
  const issuesData: {
    timestamp: string;
    overrides?: Partial<CreateIssueData>;
  }[] = [
    {
      timestamp: isoFromNow(25000),
      overrides: { name: "Nothing like the rest", fingerprint: "123" },
    },
    { timestamp: isoFromNow(20000), overrides: { fingerprint: "234" } },
    { timestamp: isoFromNow(15000), overrides: { fingerprint: "345" } },
    {
      timestamp: isoFromNow(10000),
      overrides: { name: "Error 2", fingerprint: "456" },
    },
    {
      timestamp: isoFromNow(5000),
      overrides: { name: "Error 3", fingerprint: "567" },
    },
    { timestamp: isoFromNow(0), overrides: { fingerprint: "678" } },
  ];

  beforeEach(async () => {
    await Promise.all(
      issuesData.map(async ({ timestamp, overrides }) => {
        const issueData = createCreateIssueData(timestamp, overrides);
        await storage.createIssue(issueData);
      })
    );
  }, 5000);

  it("should sort the issues by createdAt in descending order", async () => {
    const issues = await storage.getPaginatedIssues({
      searchString: "",
      page: 1,
      perPage: 10,
      resolved: false,
    });

    let lastTimestamp = new Date().toISOString();
    for (const issue of issues) {
      expect(issue.createdAt < lastTimestamp).toBe(true);
      lastTimestamp = issue.createdAt;
    }
    expect.assertions(issuesData.length);
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
  });

  it("should apply the supplied filters", async () => {
    const testData: {
      filters: GetIssuesFilters;
      expectedFPrints: Issue["fingerprint"][];
    }[] = [
      {
        filters: { searchString: "error", resolved: false },
        expectedFPrints: ["678", "567", "456", "345", "234"],
      },
      {
        filters: { searchString: "error 2", resolved: false },
        expectedFPrints: ["456"],
      },
      {
        filters: { searchString: "", resolved: false },
        expectedFPrints: ["678", "567", "456", "345", "234", "123"],
      },
      { filters: { searchString: "", resolved: true }, expectedFPrints: [] },
      {
        filters: {
          searchString: "",
          startDate: isoFromNow(10000),
          resolved: false,
        },
        expectedFPrints: ["678", "567", "456"],
      },
      {
        filters: {
          searchString: "",
          endDate: isoFromNow(15000),
          resolved: false,
        },
        expectedFPrints: ["345", "234", "123"],
      },
      {
        filters: {
          searchString: "",
          startDate: isoFromNow(25000),
          endDate: isoFromNow(10000),
          resolved: false,
        },
        expectedFPrints: ["456", "345", "234", "123"],
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
  });
});
