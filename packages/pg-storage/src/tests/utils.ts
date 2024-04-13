import { Storage } from "@codewatch/core";
import { config } from "dotenv";
import { Pool } from "pg";
import SQL from "sql-template-strings";

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

export type CreateIssueData = Parameters<Storage["createIssue"]>[number];
export const createCreateIssueData = (
  timestamp: string,
  overrides?: Partial<CreateIssueData>
) => {
  const issue: CreateIssueData = {
    fingerprint: "123456789012345678",
    lastOccurrenceTimestamp: timestamp,
    createdAt: timestamp,
    lastOccurrenceMessage: "",
    muted: false,
    totalOccurrences: 0,
    unhandled: false,
    name: "Error 1",
    stack: "Error 1",
    ...overrides,
  };
  return issue;
};
