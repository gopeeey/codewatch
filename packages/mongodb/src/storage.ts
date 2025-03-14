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
import mongoose from "mongoose";
import { IssueModel } from "./IssueModel";
import { MongoDbTransaction } from "./transaction";

export class MongoDbStorage implements Storage {
  connectionString: string;

  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  ready = false;

  async init() {
    await mongoose.connect(this.connectionString);
    this.ready = true;
  }

  async close() {
    await mongoose.connection.close();
    this.ready = false;
  }

  async createIssue(
    data: Omit<Issue, "id" | "resolved" | "createdAt">,
    transaction: Transaction
  ) {
    const [issue] = await IssueModel.create([data], {
      session: (transaction as MongoDbTransaction).session,
    });
    return issue.id;
  }

  async addOccurrence(data: Occurrence, transaction: Transaction) {}

  async archiveIssues(ids: Issue["id"][]) {}

  async createTransaction() {
    return MongoDbTransaction.start();
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
