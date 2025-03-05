import { StorageTester } from "codewatch-core/dist/dev/storage/test/StorageTester";
import { Issue, Occurrence } from "codewatch-core/dist/types";
import SQL from "sql-template-strings";
import { CodewatchPgStorage, PgTransaction } from "../storage";
import { DbIssue } from "../types";
import { setup } from "./utils";

const getStorage = () => {
  const storage = new CodewatchPgStorage({
    user: process.env.POSTGRES_DB_USERNAME,
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB_NAME,
    password: process.env.POSTGRES_DB_PASSWORD,
    port: Number(process.env.POSTGRES_DB_PORT),
  });
  return storage;
};

const storageTester = new StorageTester(getStorage);

const pool = setup(storageTester);

storageTester.createIssue.persist_issue.setPostProcessingFunc(
  async ({ id, transaction }) => {
    const { rows } = await (transaction as PgTransaction)._client.query<
      Pick<DbIssue, "fingerprint" | "id" | "createdAt">
    >(
      SQL`--sql
      SELECT fingerprint, id, "createdAt" 
      FROM codewatch_pg_issues 
      WHERE "id" = ${id};`
    );

    return { ...rows[0], id: rows[0].id.toString() };
  }
);

storageTester.addOccurrence.create_new_occurrence.setPostProcessingFunc(
  async ({ issueId, transaction }) => {
    const { rows } = await (
      transaction as PgTransaction
    )._client.query<Occurrence>(
      SQL`
        SELECT * FROM codewatch_pg_occurrences
        WHERE "issueId" = ${issueId} 
        ORDER BY timestamp DESC;
      `
    );

    return rows[0];
  }
);

storageTester.updateLastOccurrenceOnIssue.update_issue.setPostProcessingFunc(
  async ({ issueId, transaction }) => {
    const { rows } = await (transaction as PgTransaction)._client.query<
      Pick<
        Issue,
        | "totalOccurrences"
        | "lastOccurrenceTimestamp"
        | "lastOccurrenceMessage"
        | "resolved"
      >
    >(
      SQL`
        SELECT 
        "totalOccurrences", 
        "lastOccurrenceTimestamp",
        "lastOccurrenceMessage",
        "resolved" 
        FROM codewatch_pg_issues 
        WHERE id = ${issueId};`
    );

    return rows[0];
  }
);

storageTester.run();
