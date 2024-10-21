import {
  Issue,
  Occurrence,
  UpdateLastOccurrenceOnIssueType,
} from "@codewatch/types";
import SQL from "sql-template-strings";
import { PgTransaction } from "../storage";
import { DbIssue } from "../types";
import { createCreateIssueData, dbSetup, getStorage } from "./utils";

const pool = dbSetup();

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
  it("should create a new issue row", async () => {
    const now = new Date().toISOString();
    const issueData = createCreateIssueData(now);
    const storage = await getStorage();
    const transaction = await storage.createTransaction();
    const testStart = Date.now();
    const id = await storage.createIssue(issueData, transaction);
    const testEnd = Date.now();

    const { rows } = await (transaction as PgTransaction)._client.query<
      Pick<DbIssue, "fingerprint" | "id" | "createdAt">
    >(SQL`SELECT fingerprint, id, "createdAt" FROM codewatch_pg_issues;`);

    await transaction.rollbackAndEnd(); // Or commit and end, doesn't matter.

    expect(rows[0].id.toString()).toBe(id);
    expect(rows[0].fingerprint).toBe(issueData.fingerprint);
    expect(new Date(rows[0].createdAt).getTime()).toBeGreaterThanOrEqual(
      testStart
    );
    expect(new Date(rows[0].createdAt).getTime()).toBeLessThanOrEqual(testEnd);
    await storage.close();
  });
});

describe("addOccurrence", () => {
  it("should create a new occurrence record", async () => {
    const now = new Date().toISOString();
    const issueData = createCreateIssueData(now);
    const storage = await getStorage();
    const transaction = await storage.createTransaction();
    const issueId = await storage.createIssue(issueData, transaction);

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
    await storage.addOccurrence(data, transaction);

    const { rows } = await (
      transaction as PgTransaction
    )._client.query<Occurrence>(
      SQL`
        SELECT * FROM codewatch_pg_occurrences
        WHERE "issueId" = ${issueId} 
        ORDER BY timestamp DESC;
      `
    );

    await transaction.rollbackAndEnd();

    expect(rows).toHaveLength(1);
    rows[0].issueId = rows[0].issueId.toString();
    expect(rows[0]).toMatchObject(data);
    await storage.close();
  });
});

describe("updateLastOccurrenceOnIssue", () => {
  it("should update the last occurrence timestamp, increment total occurrences and update resolved", async () => {
    const now = new Date().toISOString();
    const issueData = createCreateIssueData(now);
    const storage = await getStorage();
    const transaction = await storage.createTransaction();
    const issueId = await storage.createIssue(issueData, transaction);

    const updates: Omit<UpdateLastOccurrenceOnIssueType, "issueId">[] = [
      {
        message: "Error 1",
        timestamp: now,
        stack: "Something",
        resolved: false,
      },
      {
        message: "Error 2",
        timestamp: now,
        stack: "Something new",
        resolved: true,
      },
    ];

    for (let i = 0; i < updates.length; i++) {
      const update = updates[i];
      await storage.updateLastOccurrenceOnIssue(
        {
          issueId,
          ...update,
        },
        transaction
      );

      const { rows } = await (transaction as PgTransaction)._client.query<
        Pick<
          Issue,
          | "totalOccurrences"
          | "lastOccurrenceTimestamp"
          | "stack"
          | "lastOccurrenceMessage"
          | "resolved"
        >
      >(
        SQL`
        SELECT 
        "totalOccurrences", 
        "lastOccurrenceTimestamp", 
        "stack", 
        "lastOccurrenceMessage",
        "resolved" 
        FROM codewatch_pg_issues 
        WHERE id = ${issueId};`
      );

      await transaction.commit();

      expect(rows[0].totalOccurrences).toBe(i + 2);
      expect(rows[0].lastOccurrenceTimestamp).toBe(update.timestamp);
      expect(rows[0].stack).toBe(update.stack);
      expect(rows[0].resolved).toBe(update.resolved);
      expect(rows[0].lastOccurrenceMessage).toBe(update.message);
    }
    await transaction.end();
    await storage.close();
  });
});

describe("findIssueIdxArchiveStatusByFingerprint", () => {
  describe("given an existing error record", () => {
    it("should return the id of the record", async () => {
      const now = new Date().toISOString();
      const issueData = createCreateIssueData(now);
      const storage = await getStorage();
      const transaction = await storage.createTransaction();
      const issueId = await storage.createIssue(issueData, transaction);

      const foundIssue = await storage.findIssueIdxArchiveStatusByFingerprint(
        issueData.fingerprint,
        transaction
      );
      await transaction.commitAndEnd();

      if (!foundIssue) throw new Error("Issue not found");
      expect(foundIssue.id).toBe(issueId);
      expect(foundIssue.archived).toBe(false);
      await storage.close();
    });
  });

  describe("given a non-existing error record", () => {
    it("should return null", async () => {
      const fingerprint = "123456789012345678";

      const storage = await getStorage();
      const foundIssue = await storage.findIssueIdxArchiveStatusByFingerprint(
        fingerprint
      );

      expect(foundIssue).toBeNull();
      await storage.close();
    });
  });
});

describe("runInTransaction", () => {
  it("should call it's callback with a transaction", async () => {
    const callback = jest.fn();
    const storage = await getStorage();
    await storage.runInTransaction(callback);
    expect(callback).toHaveBeenCalledWith(expect.any(PgTransaction));
    await storage.close();
  });

  describe("given the callback throws an error", () => {
    it("should rollback the transaction and throw the error", async () => {
      const err = new Error("Hello there");
      const fingerprint = "somethingspecial";
      const storage = await getStorage();

      expect(async () => {
        await storage.runInTransaction(async (transaction) => {
          const issueData = createCreateIssueData(new Date().toISOString(), {
            fingerprint,
          });
          await storage.createIssue(issueData, transaction);
          throw err;
        });
      }).rejects.toThrow(err);

      const { rows } = await pool.query<Issue>(
        SQL`SELECT * FROM codewatch_pg_issues WHERE "fingerprint" = ${fingerprint};`
      );
      expect(rows).toHaveLength(0);

      await storage.close();
    });
  });

  describe("given the callback doesn't throw an error", () => {
    it("should commit the transaction and return the return value of the callback", async () => {
      const storage = await getStorage();
      const id = await storage.runInTransaction(async (transaction) => {
        const issueData = createCreateIssueData(new Date().toISOString());
        return await storage.createIssue(issueData, transaction);
      });

      expect(id).not.toBeUndefined();
      expect(Number(id)).toBeGreaterThan(0);
      const { rows } = await pool.query<Issue>(
        SQL`SELECT * FROM codewatch_pg_issues WHERE id = ${id};`
      );
      expect(rows).toHaveLength(1);
      await storage.close();
    });
  });
});
