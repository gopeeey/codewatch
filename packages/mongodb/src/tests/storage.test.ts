import { StorageTester } from "codewatch-core/dist/storage";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { MongoDbStorage } from "../storage";
import { MongoDbTransaction } from "../transaction";
import { Helper } from "./helpers";

const mongod = await MongoMemoryReplSet.create();

const mongoUri = mongod.getUri();
const storage = new MongoDbStorage(mongod.getUri());
const tester = new StorageTester(storage);
const helper = new Helper(storage.connection);

tester.setCleanupTablesFunc(async () => {
  await storage.issues.deleteMany();
  await storage.occurrences.deleteMany();
});

tester.init.change_ready_state_to_true.setSeedFunc(
  helper.makeGetStorageFn(mongoUri)
);

tester.close.change_ready_state_to_false.setSeedFunc(
  helper.makeGetStorageFn(mongoUri)
);

tester.createIssue.persist_issue.setPostProcessingFunc(
  async ({ id, transaction }) => {
    return helper.getIssueById(
      id,
      (transaction as MongoDbTransaction)?.session
    );
  }
);

tester.runInTransaction.call_back_throws_error.rollback_transaction.setPostProcessingFunc(
  async ({ fingerprint }) => {
    return helper.getIssueByFingerprint(fingerprint);
  }
);

tester.runInTransaction.call_back_doesnt_throw_error.commit_transaction.setPostProcessingFunc(
  async ({ issueId }) => {
    return helper.getIssueById(issueId);
  }
);

tester.addOccurrence.create_new_occurrence.setPostProcessingFunc(
  async ({ issueId, transaction }) => {
    return helper.getOccurrenceWithIssueId(
      issueId,
      (transaction as MongoDbTransaction)?.session
    );
  }
);

tester.updateLastOccurrenceOnIssue.update_issue.setPostProcessingFunc(
  async ({ issueId, transaction }) => {
    return helper.getLastOccurrenceUpdatedIssue(
      issueId,
      (transaction as MongoDbTransaction)?.session
    );
  }
);

tester.seededCrud.setInsertIssuesFn(helper.insertTestIssues.bind(helper));

tester.seededCrud.setInsertOccurrencesFn(
  helper.insertTestOccurrences.bind(helper)
);

tester.seededCrud.delete_issues.delete_issues_with_supplied_ids.setSeedFunc(
  async () => helper.get2Issues()
);

tester.seededCrud.delete_issues.delete_issues_with_supplied_ids.setPostProcessingFunc(
  helper.getMultipleIssuesById.bind(helper)
);

tester.seededCrud.resolve_issues.update_resolved_to_true.setSeedFunc(async () =>
  helper.get2Issues({ resolved: false })
);

tester.seededCrud.resolve_issues.update_resolved_to_true.setPostProcessingFunc(
  helper.getMultipleIssuesById.bind(helper)
);

tester.seededCrud.unresolve_issues.update_resolved_to_false.setSeedFunc(
  async () => {
    await helper.updateAllIssuesToResolved();
    return helper.get2Issues({ resolved: true });
  }
);

tester.seededCrud.unresolve_issues.update_resolved_to_false.setPostProcessingFunc(
  helper.getMultipleIssuesById.bind(helper)
);

tester.seededCrud.archive_issues.update_archived_to_true.setSeedFunc(async () =>
  helper.get2Issues({ archived: false })
);

tester.seededCrud.archive_issues.update_archived_to_true.setPostProcessingFunc(
  helper.getMultipleIssuesById.bind(helper)
);

tester.seededCrud.unarchive_issues.update_archived_to_false.setSeedFunc(
  async () => {
    await helper.updateAllIssuesToArchived();
    return helper.get2Issues({ archived: true });
  }
);

tester.seededCrud.unarchive_issues.update_archived_to_false.setPostProcessingFunc(
  helper.getMultipleIssuesById.bind(helper)
);

tester.seededCrud.find_issue_by_id.issue_exists.return_issue.setSeedFunc(
  async ({ issueId, transaction }) => {
    return helper.getIssueById(
      issueId,
      (transaction as MongoDbTransaction)?.session
    );
  }
);

describe("Storage with transactions", () => {
  beforeAll(async () => {
    await new Promise((res, rej) => {
      console.log("Connection ready state: " + storage.connection.readyState);
      if (storage.connection.readyState === 1) return res("");
      storage.connection.on("connected", res);
      storage.connection.on("error", rej);
    });
  }, 20000);

  afterAll(async () => {
    await mongod.stop();
  });

  tester.run();
});
