import { StorageTester } from "codewatch-core/dist/storage";
import { Issue } from "codewatch-core/dist/types";
import dotenv from "dotenv";
import { ClientSession } from "mongoose";
import { IssueModel } from "../IssueModel";
import { MongoDbStorage } from "../storage";
import { MongoDbTransaction } from "../transaction";
import { dbIssueToIssue } from "../utils";

dotenv.config();

function getStorage() {
  const storage = new MongoDbStorage(
    process.env.MONGODB_CONNECTION_STRING as string
  );
  return storage;
}

const tester = new StorageTester(getStorage);

async function getIssueById(
  id: Issue["id"],
  session: ClientSession
): Promise<Issue | null> {
  const issue = await IssueModel.findOne({ id }, null, { session });
  if (!issue) return null;
  return dbIssueToIssue(issue);
}

tester.createIssue.persist_issue.setPostProcessingFunc(
  async ({ id, transaction }) => {
    return getIssueById(id, (transaction as MongoDbTransaction).session);
  }
);

tester.run();
