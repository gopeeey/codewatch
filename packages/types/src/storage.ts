import { Issue, Occurrence } from "./base";
import {
  GetIssuesFilters,
  GetPaginatedIssuesFilters,
  GetPaginatedOccurrencesFilters,
} from "./requests";

export interface UpdateLastOccurrenceOnIssueType
  extends Pick<Occurrence, "issueId" | "timestamp" | "message"> {
  stack: Issue["stack"];
  resolved: boolean;
}

export interface Transaction {
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  end: () => Promise<void>;
  commitAndEnd: () => Promise<void>;
  rollbackAndEnd: () => Promise<void>;
}

export interface Storage {
  ready: boolean;
  init: () => Promise<void>;
  createTransaction: () => Promise<Transaction>;
  runInTransaction: <T>(fn: (trx: Transaction) => Promise<T>) => Promise<T>;
  createIssue: (
    data: Omit<Issue, "id" | "resolved">,
    transaction: Transaction
  ) => Promise<Issue["id"]>;
  addOccurrence: (data: Occurrence, transaction: Transaction) => Promise<void>;
  updateLastOccurrenceOnIssue: (
    data: UpdateLastOccurrenceOnIssueType,
    transaction: Transaction
  ) => Promise<void>;
  findIssueIdxArchiveStatusByFingerprint: (
    fingerprint: Issue["fingerprint"],
    transaction?: Transaction
  ) => Promise<Pick<Issue, "id" | "archived"> | null>;
  findIssueById: (
    id: Issue["id"],
    transaction?: Transaction
  ) => Promise<Issue | null>;
  close: () => Promise<void>;
  getPaginatedIssues: (filters: GetPaginatedIssuesFilters) => Promise<Issue[]>;
  getPaginatedOccurrences: (
    filters: GetPaginatedOccurrencesFilters
  ) => Promise<Occurrence[]>;
  getIssuesTotal: (filters: GetIssuesFilters) => Promise<number>;
  deleteIssues: (issueIds: Issue["id"][]) => Promise<void>;
  resolveIssues: (issueIds: Issue["id"][]) => Promise<void>;
  unresolveIssues: (issueIds: Issue["id"][]) => Promise<void>;
  archiveIssues: (issueIds: Issue["id"][]) => Promise<void>;
  unarchiveIssues: (issueIds: Issue["id"][]) => Promise<void>;
}
