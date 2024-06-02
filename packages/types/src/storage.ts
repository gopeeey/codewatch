import { Issue, Occurrence } from "./base";
import {
  GetIssuesFilters,
  GetPaginatedIssuesFilters,
  GetPaginatedOccurrencesFilters,
} from "./requests";

export interface UpdateLastOccurrenceOnIssueType
  extends Pick<Occurrence, "issueId" | "timestamp" | "message"> {
  stack: Issue["stack"];
}

export interface Storage {
  ready: boolean;
  init: () => Promise<void>;
  createIssue: (data: Omit<Issue, "id" | "resolved">) => Promise<Issue["id"]>;
  addOccurrence: (data: Occurrence) => Promise<void>;
  updateLastOccurrenceOnIssue: (
    data: UpdateLastOccurrenceOnIssueType
  ) => Promise<void>;
  findIssueIdByFingerprint: (
    fingerprint: Issue["fingerprint"]
  ) => Promise<Issue["id"] | null>;
  findIssueById: (id: Issue["id"]) => Promise<Issue | null>;
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
