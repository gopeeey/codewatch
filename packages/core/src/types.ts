export interface Issue {
  id: string;
  fingerprint: string;
  stack: string;
  name: string;
  totalOccurrences: number;
  lastOccurrenceTimestamp: string;
  lastOccurrenceMessage: string;
  muted: boolean;
  unhandled: boolean;
  createdAt: string;
}

export type StdChannelLog = { timestamp: number; message: string };
export interface Occurrence {
  issueId: Issue["id"];
  message: string;
  timestamp: string;
  stdoutLogs: StdChannelLog[];
  stderrLogs: StdChannelLog[];
}

export type GetIssuesFilters = {
  searchString: string;
  startDate?: string;
  endDate?: string;
  resolved: boolean;
};

export interface GetPaginatedIssuesFilters extends GetIssuesFilters {
  page: number;
  perPage: number;
}

export interface Storage {
  init: () => Promise<void>;
  createIssue: (data: Omit<Issue, "id">) => Promise<Issue["id"]>;
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
}
