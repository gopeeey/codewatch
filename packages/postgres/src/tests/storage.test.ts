import { StorageTester } from "codewatch-core/dist/storage";
import { Issue, Occurrence, Transaction } from "codewatch-core/dist/types";
import SQL from "sql-template-strings";
import { PgTransaction } from "../storage";
import { DbIssue } from "../types";
import { generateBulkInsert, getStorage, setup } from "./utils";

const storage = getStorage();

const dbIssueToIssue = (dbIssue: DbIssue) => {
  return {
    ...dbIssue,
    id: dbIssue.id.toString(),
  };
};

const storageTester = new StorageTester(storage);

const pool = setup(storageTester);

async function getIssueById(
  issueId: Issue["id"],
  transaction?: Transaction
): Promise<Issue | null> {
  let queryFunc = pool.query.bind(pool);
  if (transaction && transaction instanceof PgTransaction) {
    queryFunc = transaction._client.query.bind(transaction._client);
  }
  const { rows } = await queryFunc<DbIssue>(
    SQL`SELECT * FROM codewatch_pg_issues WHERE id = ${issueId};`
  );
  if (rows[0]) return dbIssueToIssue(rows[0]);
  return null;
}

async function getMultipleIssuesByIds(ids: Issue["id"][]): Promise<Issue[]> {
  const { rows: resolvedIssues } = await pool.query<DbIssue>(
    SQL`SELECT * FROM codewatch_pg_issues WHERE id = ANY(${ids});`
  );

  return resolvedIssues.map(dbIssueToIssue);
}

storageTester.init.change_ready_state_to_true.setSeedFunc(async () => {
  return getStorage();
});

storageTester.close.change_ready_state_to_false.setSeedFunc(async () => {
  return getStorage();
});

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

storageTester.seededCrud.setInsertIssuesFn(async (data) => {
  const query = generateBulkInsert("codewatch_pg_issues", data, "*");

  try {
    const { rows } = await pool.query<DbIssue>(query);
    if (!rows.length) throw new Error("Failed to insert issue");
    return rows.map(dbIssueToIssue);
  } catch (err) {
    console.log(query.sql);
    throw err;
  }
});

storageTester.seededCrud.setInsertOccurrencesFn(async (data) => {
  const query = generateBulkInsert("codewatch_pg_occurrences", data);
  await pool.query(query);
});

storageTester.seededCrud.delete_issues.delete_issues_with_supplied_ids.setSeedFunc(
  async () => {
    const { rows: issues } = await pool.query<DbIssue>(
      SQL`SELECT * FROM codewatch_pg_issues LIMIT 2;`
    );
    return issues.map(dbIssueToIssue);
  }
);

storageTester.seededCrud.delete_issues.delete_issues_with_supplied_ids.setPostProcessingFunc(
  getMultipleIssuesByIds
);

storageTester.seededCrud.resolve_issues.update_resolved_to_true.setSeedFunc(
  async () => {
    const { rows: issues } = await pool.query<DbIssue>(
      SQL`SELECT * FROM codewatch_pg_issues WHERE resolved = false LIMIT 2;`
    );

    return issues.map(dbIssueToIssue);
  }
);

storageTester.seededCrud.resolve_issues.update_resolved_to_true.setPostProcessingFunc(
  getMultipleIssuesByIds
);

storageTester.seededCrud.unresolve_issues.update_resolved_to_false.setSeedFunc(
  async () => {
    await pool.query(SQL`UPDATE codewatch_pg_issues SET resolved = true;`);
    const { rows: issues } = await pool.query<DbIssue>(
      SQL`SELECT * FROM codewatch_pg_issues WHERE resolved = true LIMIT 2;`
    );

    return issues.map(dbIssueToIssue);
  }
);

storageTester.seededCrud.unresolve_issues.update_resolved_to_false.setPostProcessingFunc(
  getMultipleIssuesByIds
);

storageTester.seededCrud.archive_issues.update_archived_to_true.setSeedFunc(
  async () => {
    const { rows: issues } = await pool.query<DbIssue>(
      SQL`SELECT * FROM codewatch_pg_issues WHERE archived = false LIMIT 2;`
    );

    return issues.map(dbIssueToIssue);
  }
);

storageTester.seededCrud.archive_issues.update_archived_to_true.setPostProcessingFunc(
  getMultipleIssuesByIds
);

storageTester.seededCrud.unarchive_issues.update_archived_to_false.setSeedFunc(
  async () => {
    await pool.query(SQL`UPDATE codewatch_pg_issues SET archived = true;`);
    const { rows: issues } = await pool.query<DbIssue>(
      SQL`SELECT * FROM codewatch_pg_issues WHERE archived = true LIMIT 2;`
    );

    return issues.map(dbIssueToIssue);
  }
);

storageTester.seededCrud.unarchive_issues.update_archived_to_false.setPostProcessingFunc(
  getMultipleIssuesByIds
);

storageTester.seededCrud.find_issue_by_id.issue_exists.return_issue.setSeedFunc(
  async (data) => {
    return getIssueById(data.issueId, data.transaction);
  }
);

storageTester.run();
