import { Issue } from "codewatch-core/dist/types";
import { config } from "dotenv";
import Levenshtein from "levenshtein";
import { Pool } from "pg";
import SQL from "sql-template-strings";
import { CodewatchPgStorage } from "../storage";
import { DbIssue } from "../types";

config();

export const dbSetup = () => {
  // Connect to the database
  const pool = new Pool({
    user: process.env.POSTGRES_DB_USERNAME,
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB_NAME,
    password: process.env.POSTGRES_DB_PASSWORD,
    port: Number(process.env.POSTGRES_DB_PORT),
  });

  afterEach(async () => {
    // Truncate each table except migrations
    await pool.query(SQL`TRUNCATE codewatch_pg_issues CASCADE;`);
    await pool.query(
      SQL`ALTER SEQUENCE codewatch_pg_issues_id_seq RESTART WITH 1;`
    );
    await pool.query(
      SQL`ALTER SEQUENCE codewatch_pg_occurrences_id_seq RESTART WITH 1;`
    );
    await pool.query(SQL`TRUNCATE codewatch_pg_occurrences CASCADE;`);
  }, 5000);

  afterAll(async () => {
    await pool.query(`
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
    GRANT ALL ON SCHEMA public TO postgres;
    GRANT ALL ON SCHEMA public TO public;
    COMMENT ON SCHEMA public IS 'standard public schema';
    `);
    pool.end();
  }, 5000);

  return pool;
};

export interface CreateIssueData extends Omit<Issue, "id" | "resolved"> {
  resolved?: Issue["resolved"];
}
export const createCreateIssueData = (
  timestamp: string,
  overrides?: Partial<Omit<Issue, "id">>
) => {
  const issue: CreateIssueData = {
    fingerprint: "123456789012345678",
    lastOccurrenceTimestamp: timestamp,
    createdAt: timestamp,
    lastOccurrenceMessage: "",
    archived: false,
    totalOccurrences: 1,
    unhandled: false,
    name: "Error 1",
    stack: "Error 1",
    isLog: false,
    ...overrides,
  };
  return issue;
};

export const insertTestIssue = async (pool: Pool, data: CreateIssueData) => {
  const query = SQL`INSERT INTO codewatch_pg_issues ( "`;
  const keys: string[] = [];
  const values: string[] = [];
  for (const entry of Object.entries(data)) {
    keys.push(entry[0]);
    values.push(entry[1]);
  }
  query.append(keys.join(`", "`)).append(`") VALUES (`);
  values.forEach((value, index) => {
    if (index === values.length - 1) {
      query.append(SQL`${value}) `);
    } else {
      query.append(SQL`${value}, `);
    }
  });

  query.append("RETURNING id;");

  const { rows } = await pool.query<Pick<DbIssue, "id">>(query);

  for (let i = 0; i < data.totalOccurrences; i++) {
    const occurrenceQuery = SQL`
    INSERT INTO codewatch_pg_occurrences (
      "issueId", "message", "stderrLogs", "stdoutLogs", "timestamp"
    ) VALUES (
      ${rows[0].id},
      ${`Occurrence for ${data.name}`},
      ${[]},
      ${[]},
      ${new Date(
        i + 1 === data.totalOccurrences
          ? data.lastOccurrenceTimestamp
          : data.createdAt
      )}
    );`;

    await pool.query(occurrenceQuery);
  }
};

export const getStringDistance = (a: string, b: string) => {
  const lv = new Levenshtein(a, b);
  return lv.distance;
};

export const getStorage = async (init = true) => {
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

export const withinDateRange = (
  timestamp: string,
  startDate: string,
  endDate: string
) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const current = new Date(timestamp).getTime();
  return current >= start && current <= end;
};
