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
import { issueSchema, issuesCollectionName } from "./schemas/Issue";
import {
  occurrenceSchema,
  occurrencesCollectionName,
} from "./schemas/Occurrence";
import { MongoDbTransaction } from "./transaction";
import {
  DbIssue,
  DbOccurrence,
  IssueWithTotalOccurrencesWithinTimestamp,
} from "./types";
import {
  dbIssueToIssue,
  dbOccurrenceToOccurrence,
  docIssueToIssue,
  getTimezoneString,
} from "./utils";

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
    await this.occurrences.create([data], {
      session: (transaction as MongoDbTransaction).session,
    });
  }

  async createTransaction() {
    if (this.useTransactions) return MongoDbTransaction.start(this.issues);
    return new StorageTransaction();
  }

  async deleteIssues(ids: Issue["id"][]) {
    await this.issues.deleteMany({ id: { $in: ids } });
  }

  async findIssueById(id: Issue["id"], transaction?: Transaction) {
    const issue = await this.issues.findOne({ id: id }, null, {
      session: (transaction as MongoDbTransaction)?.session,
    });
    if (!issue) return null;
    return docIssueToIssue(issue);
  }

  async findIssueIdxArchiveStatusByFingerprint(
    fingerprint: Issue["fingerprint"],
    transaction?: T
  ) {
    const issue = await this.issues.findOne(
      { fingerprint },
      { id: 1, archived: 1 },
      { session: (transaction as MongoDbTransaction)?.session }
    );
    if (!issue) return null;
    return docIssueToIssue(issue);
  }

  private _getMatchForIssuesFilter(filters: GetIssuesFilters) {
    let match: Record<string, any> = {};

    if (filters.searchString) {
      match = { $text: { $search: filters.searchString } };
    }

    if (filters.startDate) {
      match.createdAt = { $gte: new Date(filters.startDate) };
    }

    if (filters.endDate) {
      match.createdAt = {
        ...match.createdAt,
        $lte: new Date(filters.endDate),
      };
    }

    switch (filters.tab) {
      case "archived":
        match.archived = true;
        break;
      case "resolved":
        match.resolved = true;
        match.archived = false;
        break;
      case "unresolved":
        match.resolved = false;
        match.archived = false;
        break;
      default:
        throw new Error("Unsupported tab");
    }

    return match;
  }

  async getIssuesTotal(filters: GetIssuesFilters) {
    const docs = await this.issues.aggregate<{ count: number }>([
      { $match: this._getMatchForIssuesFilter(filters) },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);
    return docs[0].count;
  }

  async getPaginatedIssues(filters: GetPaginatedIssuesFilters) {
    const pipeline: mongoose.PipelineStage[] = [
      { $match: this._getMatchForIssuesFilter(filters) },
    ];

    let sortStage: mongoose.PipelineStage = { $sort: {} };
    const order = filters.order === "asc" ? 1 : -1;

    switch (filters.sort) {
      case "created-at":
        sortStage = { $sort: { createdAt: order } };
        break;
      case "last-seen":
        sortStage = { $sort: { lastOccurrenceTimestamp: order } };
        break;
      case "total-occurrences":
        sortStage = { $sort: { totalOccurrences: order } };
        break;
      case "relevance":
        pipeline.push({
          $addFields: {
            relevance: { $meta: "textScore" },
            nameLengthDiff: {
              $subtract: [filters.searchString.length, { $strLenCP: "$name" }],
            },
          },
        });
        sortStage = { $sort: { relevance: order, nameLengthDiff: order } };
        break;
      default:
        throw new Error("Unsupported sort param");
    }
    pipeline.push(sortStage);

    pipeline.push({ $skip: (filters.page - 1) * filters.perPage });
    pipeline.push({ $limit: filters.perPage });

    const docs = await this.issues.aggregate<DbIssue>(pipeline);
    return docs.map(dbIssueToIssue);
  }

  async getPaginatedOccurrences(filters: GetPaginatedOccurrencesFilters) {
    const docs = await this.occurrences.aggregate<DbOccurrence>([
      {
        $match: {
          issueId: filters.issueId,
          timestamp: {
            $gte: new Date(filters.startDate),
            $lte: new Date(filters.endDate),
          },
        },
      },
      { $sort: { timestamp: -1 } },
      { $skip: (filters.page - 1) * filters.perPage },
      { $limit: filters.perPage },
    ]);
    return docs.map(dbOccurrenceToOccurrence);
  }

  async getStatsData(filters: GetStats) {
    const timezone = getTimezoneString(filters.timezoneOffset);
    const [rawData] = await this.occurrences.aggregate([
      {
        $match: {
          timestamp: {
            $gte: new Date(filters.startDate),
            $lte: new Date(filters.endDate),
          },
        },
      },
      {
        $lookup: {
          from: issuesCollectionName,
          localField: "issueId",
          foreignField: "id",
          as: "issue",
          pipeline: [
            {
              $project: { unhandled: 1, isLog: 1, lastOccurrenceTimestamp: 1 },
            },
          ],
        },
      },
      { $unwind: "$issue" },
      {
        $facet: {
          totalOccurrencesData: [{ $group: { _id: null, count: { $sum: 1 } } }],
          totalUnhandledOccurrencesData: [
            { $match: { "issue.unhandled": true } },
            { $group: { _id: null, count: { $sum: 1 } } },
          ],
          totalManuallyCapturedOccurrencesData: [
            { $match: { "issue.unhandled": false, "issue.isLog": false } },
            { $group: { _id: null, count: { $sum: 1 } } },
          ],
          totalLoggedDataData: [
            { $match: { "issue.isLog": true } },
            { $group: { _id: null, count: { $sum: 1 } } },
          ],
          dailyOccurrenceCount: [
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$timestamp",
                    timezone,
                  },
                },
                count: { $sum: 1 },
              },
            },
            { $project: { date: "$_id", count: 1, _id: 0 } },
            { $sort: { date: 1 } },
          ],
          dailyUnhandledOccurrenceCount: [
            { $match: { "issue.unhandled": true } },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$timestamp",
                    timezone,
                  },
                },
                count: { $sum: 1 },
              },
            },
            { $project: { date: "$_id", count: 1, _id: 0 } },
            { $sort: { date: 1 } },
          ],
          totalIssuesData: [
            { $group: { _id: "$issueId", count: { $sum: 1 } } },
            { $group: { _id: null, count: { $sum: 1 } } },
          ],
          mostRecurringIssueIdsData: [
            {
              $group: {
                _id: "$issueId",
                count: { $sum: 1 },
                lastOccurrenceTimestamp: {
                  $addToSet: "$issue.lastOccurrenceTimestamp",
                },
              },
            },
            { $unwind: "$lastOccurrenceTimestamp" },
            { $sort: { count: -1, lastOccurrenceTimestamp: -1 } },
            { $limit: 5 },
          ],
        },
      },
    ]);
    const recurringIssues = await this.issues.find({
      id: {
        $in: rawData.mostRecurringIssueIdsData.map(
          (doc: { _id: string }) => doc._id
        ),
      },
    });

    const sortedRecurringIssues: IssueWithTotalOccurrencesWithinTimestamp[] =
      [];
    for (const issue of rawData.mostRecurringIssueIdsData) {
      const foundIssue = recurringIssues.find((i) => i.id === issue._id);
      if (foundIssue) {
        sortedRecurringIssues.push({
          ...docIssueToIssue(foundIssue),
          totalOccurrencesWithinTimestamp: issue.count,
        });
      }
    }

    const data: StatsData = {
      totalOccurrences: rawData.totalOccurrencesData[0]?.count || 0,
      totalUnhandledOccurrences:
        rawData.totalUnhandledOccurrencesData[0]?.count || 0,
      totalManuallyCapturedOccurrences:
        rawData.totalManuallyCapturedOccurrencesData[0]?.count || 0,
      totalLoggedData: rawData.totalLoggedDataData[0]?.count || 0,
      dailyOccurrenceCount: rawData.dailyOccurrenceCount,
      dailyUnhandledOccurrenceCount: rawData.dailyUnhandledOccurrenceCount,
      totalIssues: rawData.totalIssuesData[0]?.count || 0,
      mostRecurringIssues: sortedRecurringIssues,
    };
    return data;
  }

  async resolveIssues(issueIds: Issue["id"][]) {
    await this.issues.updateMany({ id: { $in: issueIds } }, { resolved: true });
  }

  async unresolveIssues(issueIds: Issue["id"][]) {
    await this.issues.updateMany(
      { id: { $in: issueIds } },
      { resolved: false }
    );
  }

  async archiveIssues(issueIds: Issue["id"][]) {
    await this.issues.updateMany({ id: { $in: issueIds } }, { archived: true });
  }

  async unarchiveIssues(issueIds: Issue["id"][]) {
    await this.issues.updateMany(
      { id: { $in: issueIds } },
      { archived: false }
    );
  }

  async updateLastOccurrenceOnIssue(
    data: UpdateLastOccurrenceOnIssueType,
    transaction: Transaction
  ) {
    await this.issues.updateOne(
      { id: data.issueId },
      {
        resolved: data.resolved,
        lastOccurrenceMessage: data.message,
        lastOccurrenceTimestamp: data.timestamp,
        $inc: { totalOccurrences: 1 },
      },
      {
        session: (transaction as MongoDbTransaction).session,
      }
    );
  }

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
