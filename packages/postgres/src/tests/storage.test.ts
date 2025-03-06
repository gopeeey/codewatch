import { StorageTester } from "codewatch-core/dist/tests/storage/StorageTester";
import { Issue, Occurrence, Transaction } from "codewatch-core/dist/types";
import SQL from "sql-template-strings";
import { CodewatchPgStorage, PgTransaction } from "../storage";
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

async function getIssueById(
  issueId: Issue["id"],
  transaction?: Transaction
): Promise<Issue | null> {
  let queryFunc = pool.query.bind(pool);
  if (transaction && transaction instanceof PgTransaction) {
    queryFunc = transaction._client.query.bind(transaction._client);
  }
  const { rows } = await queryFunc<Issue>(
    SQL`SELECT * FROM codewatch_pg_issues WHERE id = ${issueId};`
  );
  if (rows[0]) {
    return {
      ...rows[0],
      id: rows[0].id.toString(),
    };
  }
  return null;
}

storageTester.createIssue.persist_issue.setPostProcessingFunc(
  async ({ id, transaction }) => {
    return getIssueById(id, transaction);
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

storageTester.runInTransaction.call_back_throws_error.rollback_transaction.setPostProcessingFunc(
  async ({ fingerprint }) => {
    const { rows } = await pool.query<Issue>(
      SQL`SELECT * FROM codewatch_pg_issues WHERE "fingerprint" = ${fingerprint};`
    );

    return rows[0] || null;
  }
);

storageTester.runInTransaction.call_back_doesnt_throw_error.commit_transaction.setPostProcessingFunc(
  async ({ issueId }) => {
    return getIssueById(issueId);
  }
);

storageTester.run();
