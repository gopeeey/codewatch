import SQL from "sql-template-strings";
import { CodewatchPgStorage } from "../storage";
import { ErrorData, Occurence } from "../types";
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
      DROP TABLE IF EXISTS codewatch_pg_errors CASCADE;`
    );

    await storage.init();

    const { rows } = await pool.query(
      SQL`SELECT tablename FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = ANY(${[
          "codewatch_pg_errors",
          "codewatch_pg_migrations",
        ]});`
    );

    const tablenames = rows.map(({ tablename }) => tablename as string);
    expect(tablenames).toContain("codewatch_pg_errors");
  });

  it("should change the storage ready state to true", async () => {
    await storage.init();

    expect(storage.ready).toBe(true);
  });
});

describe("createError", () => {
  it("should create a new error record", async () => {
    const fingerprint = "123456789012345678";
    await storage.createError({
      fingerprint,
      lastOccurenceTimestamp: new Date().toISOString(),
      name: "Error 1",
      stack: "Error 1",
    });

    const { rows } = await pool.query<Pick<ErrorData, "fingerprint">>(
      SQL`SELECT fingerprint FROM codewatch_pg_errors;`
    );

    expect(rows[0].fingerprint).toBe(fingerprint);
  });
});

describe("addOccurence", () => {
  it("should create a new occurence record", async () => {
    const now = new Date().toISOString();
    const errorId = await storage.createError({
      fingerprint: "123456789012345678",
      lastOccurenceTimestamp: now,
      name: "Error 1",
      stack: "Error 1",
    });

    const data: Occurence = { errorId, message: "Error 1", timestamp: now };
    await storage.addOccurence(data);

    const { rows } = await pool.query<Occurence>(
      SQL`
        SELECT * FROM codewatch_pg_occurences
        WHERE "errorId" = ${errorId} 
        ORDER BY timestamp DESC;
      `
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject(data);
  });
});

describe("updateLastOccurenceOnError", () => {
  it("should update the last occurence timestamp and increment total occurences", async () => {
    const now = new Date().toISOString();
    const errorId = await storage.createError({
      fingerprint: "123456789012345678",
      lastOccurenceTimestamp: now,
      name: "Error 1",
      stack: "Error 1",
    });

    const occurence: Occurence = {
      errorId,
      message: "Error 1",
      timestamp: now,
    };

    await storage.updateLastOccurenceOnError(occurence);
    await storage.updateLastOccurenceOnError(occurence);

    const { rows } = await pool.query<
      Pick<ErrorData, "totalOccurences" | "lastOccurenceTimestamp">
    >(
      SQL`SELECT "totalOccurences", "lastOccurenceTimestamp" FROM codewatch_pg_errors;`
    );

    expect(rows[0].totalOccurences).toBe(2);
    expect(rows[0].lastOccurenceTimestamp).toBe(now);
  });
});

describe("findErrorIdByFingerprint", () => {
  describe("given an existing error record", () => {
    it("should return the id of the record", async () => {
      const fingerprint = "123456789012345678";
      const errorId = await storage.createError({
        fingerprint,
        lastOccurenceTimestamp: new Date().toISOString(),
        name: "Error 1",
        stack: "Error 1",
      });

      const id = await storage.findErrorIdByFingerprint(fingerprint);

      expect(id).toBe(errorId);
    });
  });

  describe("given a non-existing error record", () => {
    it("should return null", async () => {
      const fingerprint = "123456789012345678";

      const id = await storage.findErrorIdByFingerprint(fingerprint);

      expect(id).toBeNull();
    });
  });
});
