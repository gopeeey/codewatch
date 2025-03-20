import { StorageTransaction } from "codewatch-core/dist/storage";
import { T } from "codewatch-core/dist/storage-DglIu0ty";
import {
  GetIssuesFilters,
  GetPaginatedIssuesFilters,
  GetPaginatedOccurrencesFilters,
  GetStats,
  Issue,
  Occurrence,
  StatsData,
  Storage,
  Transaction,
  UpdateLastOccurrenceOnIssueType,
} from "codewatch-core/dist/types";
import mongoose, { Connection, Model } from "mongoose";
import { issueSchema, issuesCollectionName } from "./models/Issue";
import {
  occurrenceSchema,
  occurrencesCollectionName,
} from "./models/Occurrence";
import { MongoDbTransaction } from "./transaction";
import { DbIssue, DbOccurrence } from "./types";

export class MongoDbStorage implements Storage {
  connectionString: string;
  useTransactions: boolean;
  connection: Connection;

  issues: Model<DbIssue>;
  occurrences: Model<DbOccurrence>;

  ready = false;

  constructor(connectionString: string, useTransactions = true) {
    this.connectionString = connectionString;
    this.useTransactions = useTransactions;

    this.connection = mongoose.createConnection(connectionString);
    this.issues = this.connection.model<DbIssue>(
      issuesCollectionName,
      issueSchema
    );
    this.occurrences = this.connection.model<DbOccurrence>(
      occurrencesCollectionName,
      occurrenceSchema
    );
  }

  async init() {
    if (this.connection.readyState !== 1) {
      await new Promise((resolve, reject) => {
        this.connection.on("connected", resolve);
        this.connection.on("error", reject);
      });
    }
    this.ready = true;
  }

  async close() {
    await this.connection.close();
    this.ready = false;
  }

  async createIssue(
    data: Omit<Issue, "id" | "resolved" | "createdAt">,
    transaction: Transaction
  ) {
    const [issue] = await this.issues.create([data], {
      session: (transaction as MongoDbTransaction).session,
    });
    return issue.id;
  }

  async addOccurrence(data: Occurrence, transaction: Transaction) {
    const [occurrence] = await this.occurrences.create([data], {
      session: (transaction as MongoDbTransaction).session,
    });
  }

  async archiveIssues(ids: Issue["id"][]) {}

  async createTransaction() {
    if (this.useTransactions) return MongoDbTransaction.start(this.issues);
    return new StorageTransaction();
  }

  async deleteIssues(ids: Issue["id"][]) {}

  async findIssueById(id: Issue["id"], transaction?: Transaction) {
    return null;
  }

  async findIssueIdxArchiveStatusByFingerprint(
    fingerprint: Issue["fingerprint"],
    transaction?: T
  ) {
    return null;
  }

  async getIssuesTotal(filters: GetIssuesFilters) {
    return 0;
  }

  async getPaginatedIssues(filters: GetPaginatedIssuesFilters) {
    return [];
  }

  async getPaginatedOccurrences(filters: GetPaginatedOccurrencesFilters) {
    return [];
  }

  async getStatsData(filters: GetStats) {
    return {} as StatsData;
  }

  async resolveIssues(issueIds: Issue["id"][]) {}

  async unarchiveIssues(issueIds: Issue["id"][]) {}

  async unresolveIssues(issueIds: Issue["id"][]) {}

  async updateLastOccurrenceOnIssue(
    data: UpdateLastOccurrenceOnIssueType,
    transaction: Transaction
  ) {}

  runInTransaction: Storage["runInTransaction"] = async (fn) => {
    const transaction = await this.createTransaction();
    try {
      const val = await fn(transaction);
      await transaction.commitAndEnd();
      return val;
    } catch (err) {
      await transaction.rollbackAndEnd();
      throw err;
    }
  };
}
