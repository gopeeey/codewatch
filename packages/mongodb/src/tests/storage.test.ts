import { StorageTester } from "codewatch-core/dist/storage";
import { MongoDbTransaction } from "../transaction";
import { getStorage, Helper, makeInitSd } from "./helpers";

const storage = getStorage();
const tester = new StorageTester(storage);
const helper = new Helper(storage.connection);

tester.setCleanupTablesFunc(async () => {
  await storage.issues.deleteMany();
  await storage.occurrences.deleteMany();
});

tester.init.change_ready_state_to_true.setSeedFunc(makeInitSd());
tester.init.change_ready_state_to_true.setTimeout(10000);

tester.close.change_ready_state_to_false.setSeedFunc(makeInitSd());
tester.close.change_ready_state_to_false.setTimeout(10000);

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

describe("Storage with transactions", () => {
  beforeAll(async () => {
    await new Promise((res, rej) => {
      console.log("Connection ready state: " + storage.connection.readyState);
      if (storage.connection.readyState === 1) return res("");
      storage.connection.on("connected", res);
      storage.connection.on("error", rej);
    });
  }, 20000);

  tester.run();
});
