import { Issue, Occurrence } from "@codewatch/core";
import SQL from "sql-template-strings";
import { CodewatchPgStorage } from "../storage";
import { dbSetup } from "./utils";

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
    const fingerprint = "123456789012345678";
    await storage.createIssue({
      fingerprint,
      lastOccurrenceTimestamp: new Date().toISOString(),
      lastOccurrenceMessage: "",
      createdAt: new Date().toISOString(),
      muted: false,
      totalOccurrences: 1,
      unhandled: false,
      name: "Error 1",
      stack: "Error 1",
    });

    const { rows } = await pool.query<Pick<Issue, "fingerprint">>(
      SQL`SELECT fingerprint FROM codewatch_pg_issues;`
    );

    expect(rows[0].fingerprint).toBe(fingerprint);
  });
});

describe("addOccurrence", () => {
  it("should create a new occurrence record", async () => {
    const now = new Date().toISOString();
    const issueId = await storage.createIssue({
      fingerprint: "123456789012345678",
      lastOccurrenceTimestamp: now,
      lastOccurrenceMessage: "",
      createdAt: now,
      muted: false,
      totalOccurrences: 1,
      unhandled: false,
      name: "Error 1",
      stack: "Error 1",
    });

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
    const issueId = await storage.createIssue({
      fingerprint: "123456789012345678",
      lastOccurrenceTimestamp: now,
      createdAt: now,
      lastOccurrenceMessage: "",
      muted: false,
      totalOccurrences: 0,
      unhandled: false,
      name: "Error 1",
      stack: "Error 1",
    });

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
      const fingerprint = "123456789012345678";
      const issueId = await storage.createIssue({
        fingerprint,
        lastOccurrenceTimestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        lastOccurrenceMessage: "",
        muted: false,
        totalOccurrences: 1,
        unhandled: false,
        name: "Error 1",
        stack: "Error 1",
      });

      const id = await storage.findIssueIdByFingerprint(fingerprint);

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
