import { StorageTester } from "codewatch-core/dist/storage";
import { config } from "dotenv";
import pg from "pg";
import SQL from "sql-template-strings";
import { CodewatchPgStorage } from "../storage";

config();

export const setup = (tester: StorageTester) => {
  // Connect to the database
  const pool = new pg.Pool({
    user: process.env.POSTGRES_DB_USERNAME,
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB_NAME,
    password: process.env.POSTGRES_DB_PASSWORD,
    port: Number(process.env.POSTGRES_DB_PORT),
  });

  tester.setCleanupTablesFunc(async () => {
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

  tester.setCleanupDbFunc(async () => {
    try {
      await pool.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO postgres;
      GRANT ALL ON SCHEMA public TO public;
      COMMENT ON SCHEMA public IS 'standard public schema';
      `);
      await pool.end();
    } catch (err) {
      console.error("Failed to clean up database connection", err);
    }
  }, 5000);

  return pool;
};

export const generateBulkInsert = (
  tableName: string,
  data: Record<any, any>[],
  returning?: string
) => {
  const query = SQL`INSERT INTO `;
  query.append(tableName);
  query.append(` ( "`);
  const keySet = new Set<string>();
  data.forEach((row) => {
    Object.keys(row).forEach((key) => {
      keySet.add(key);
    });
  });

  const keys = [...keySet];
  query.append(keys.join(`", "`)).append(`") VALUES `);

  for (let i = 0; i < data.length; i++) {
    const valueQuery = SQL`(`;
    const values = keys.map((key) => {
      if (key === "resolved") return Boolean(data[i][key]);
      return data[i][key];
    });

    values.forEach((value, index) => {
      if (index === values.length - 1) {
        valueQuery.append(SQL`${value}) `);
      } else {
        valueQuery.append(SQL`${value}, `);
      }
    });

    query.append(valueQuery);

    if (i !== data.length - 1) {
      query.append(SQL`, `);
    }
  }

  if (returning) {
    query.append(` RETURNING ${returning};`);
  } else {
    query.append(";");
  }

  return query;
};

export const getStorage = () => {
  const storage = new CodewatchPgStorage({
    user: process.env.POSTGRES_DB_USERNAME,
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB_NAME,
    password: process.env.POSTGRES_DB_PASSWORD,
    port: Number(process.env.POSTGRES_DB_PORT),
  });

  return storage;
};
