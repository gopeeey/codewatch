import { Issue, Occurrence } from "./base";
import { GetIssuesFilters, GetPaginatedIssuesFilters } from "./requests";

export interface Storage {
  ready: boolean;
  init: () => Promise<void>;
  createIssue: (data: Omit<Issue, "id" | "resolved">) => Promise<Issue["id"]>;
  addOccurrence: (data: Occurrence) => Promise<void>;
  updateLastOccurrenceOnIssue: (
    data: Pick<Occurrence, "issueId" | "timestamp" | "message">
  ) => Promise<void>;
  findIssueIdByFingerprint: (
    fingerprint: Issue["fingerprint"]
  ) => Promise<Issue["id"] | null>;
  close: () => Promise<void>;
  getPaginatedIssues: (filters: GetPaginatedIssuesFilters) => Promise<Issue[]>;
  getIssuesTotal: (filters: GetIssuesFilters) => Promise<number>;
  deleteIssues: (issueIds: Issue["id"][]) => Promise<void>;
  resolveIssues: (issueIds: Issue["id"][]) => Promise<void>;
  unresolveIssues: (issueIds: Issue["id"][]) => Promise<void>;
}
