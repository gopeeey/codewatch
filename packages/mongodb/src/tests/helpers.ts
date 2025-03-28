import { Issue, Occurrence } from "codewatch-core/dist/types";
import dotenv from "dotenv";
import {
  ClientSession,
  Connection,
  Model,
  ProjectionType,
  RootFilterQuery,
} from "mongoose";
import { issueSchema, issuesCollectionName } from "../schemas/Issue";
import {
  occurrenceSchema,
  occurrencesCollectionName,
} from "../schemas/Occurrence";
import { MongoDbStorage } from "../storage";
import { DbIssue, DbOccurrence } from "../types";
import { docIssueToIssue, docOccurrenceToOccurrence } from "../utils";

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

  makeGetStorageFn(uri: string, useTransactions = true) {
    return async () => {
      return new MongoDbStorage(uri, useTransactions);
    };
  }

  async getIssueById(
    id: Issue["id"],
    session?: ClientSession,
    projection: ProjectionType<DbIssue> | null = null
  ): Promise<Issue | null> {
    const issue = await this.issues.findOne({ id }, projection, { session });
    if (!issue) return null;
    return docIssueToIssue(issue);
  }

  async getMultipleIssuesById(
    ids: Issue["id"][],
    session?: ClientSession,
    projection: ProjectionType<DbIssue> | null = null
  ) {
    const issues = await this.issues.find({ id: { $in: ids } }, projection, {
      session,
    });
    return issues.map(docIssueToIssue);
  }

  async getIssueByFingerprint(
    fingerprint: Issue["fingerprint"],
    session?: ClientSession,
    projection: ProjectionType<DbIssue> | null = null
  ) {
    const issue = await this.issues.findOne({ fingerprint }, projection, {
      session,
    });
    if (!issue) return null;
    return docIssueToIssue(issue);
  }

  async getOccurrenceWithIssueId(
    issueId: Issue["id"],
    session?: ClientSession
  ) {
    const occurrence = await this.occurrences.findOne({ issueId }, null, {
      session,
    });
    if (!occurrence) return null;
    return docOccurrenceToOccurrence(occurrence);
  }

  async getLastOccurrenceUpdatedIssue(
    issueId: Issue["id"],
    session?: ClientSession
  ) {
    const issue = await this.getIssueById(issueId, session, {
      totalOccurrences: 1,
      lastOccurrenceMessage: 1,
      resolved: 1,
      lastOccurrenceTimestamp: 1,
    });
    if (!issue) return null;
    return issue as Pick<
      Issue,
      | "totalOccurrences"
      | "lastOccurrenceMessage"
      | "lastOccurrenceTimestamp"
      | "resolved"
    >;
  }

  async insertTestIssues(data: Partial<Issue>[]) {
    const issues = await this.issues.create(data);
    return issues.map(docIssueToIssue);
  }

  async insertTestOccurrences(data: Partial<Occurrence>[]) {
    await this.occurrences.create(data);
  }

  async get2Issues(query?: RootFilterQuery<DbIssue>) {
    const issues = await this.issues.find(query ?? {}).limit(2);
    return issues.map(docIssueToIssue);
  }

  async updateAllIssuesToResolved() {
    await this.issues.updateMany({}, { resolved: true });
  }

  async updateAllIssuesToArchived() {
    await this.issues.updateMany({}, { archived: true });
  }
}
