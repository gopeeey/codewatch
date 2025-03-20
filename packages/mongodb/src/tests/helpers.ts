import { Issue } from "codewatch-core/dist/types";
import dotenv from "dotenv";
import { ClientSession, Connection, Model } from "mongoose";
import { issueSchema, issuesCollectionName } from "../models/Issue";
import {
  occurrenceSchema,
  occurrencesCollectionName,
} from "../models/Occurrence";
import { MongoDbStorage } from "../storage";
import { DbIssue, DbOccurrence } from "../types";
import { dbIssueToIssue, dbOccurrenceToOccurrence } from "../utils";

dotenv.config();

export function getConnectionString(useTransactions = true) {
  return (
    useTransactions
      ? process.env.MONGODB_CONNECTION_STRING
      : process.env.MONGODB_LOCAL_CONNECTION_STRING
  ) as string;
}

export function getStorage(useTransactions = true) {
  const storage = new MongoDbStorage(
    getConnectionString(useTransactions),
    useTransactions
  );
  return storage;
}

export function makeInitSd(useTransactions = true) {
  return async () => {
    return getStorage(useTransactions);
  };
}

export class Helper {
  issues: Model<DbIssue>;
  occurrences: Model<DbOccurrence>;
  constructor(public connection: Connection) {
    this.issues = this.connection.model<DbIssue>(
      issuesCollectionName,
      issueSchema
    );

    this.occurrences = this.connection.model<DbOccurrence>(
      occurrencesCollectionName,
      occurrenceSchema
    );
  }

  async getIssueById(
    id: Issue["id"],
    session?: ClientSession
  ): Promise<Issue | null> {
    const issue = await this.issues.findOne({ id }, null, { session });
    if (!issue) return null;
    return dbIssueToIssue(issue);
  }

  async getIssueByFingerprint({
    fingerprint,
  }: {
    fingerprint: Issue["fingerprint"];
  }) {
    const issue = await this.issues.findOne({ fingerprint });
    if (!issue) return null;
    return dbIssueToIssue(issue);
  }

  async getOccurrenceWithIssueId(
    issueId: Issue["id"],
    session?: ClientSession
  ) {
    const occurrence = await this.occurrences.findOne({ issueId }, null, {
      session,
    });
    if (!occurrence) return null;
    return dbOccurrenceToOccurrence(occurrence);
  }
}
