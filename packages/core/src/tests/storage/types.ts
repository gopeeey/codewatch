import { Issue, Occurrence } from "src/types";

export interface CreateIssueData extends Omit<Issue, "id" | "resolved"> {
  resolved?: Issue["resolved"];
}

export type CraeteOccurrenceData = Pick<
  Occurrence,
  "issueId" | "message" | "stderrLogs" | "stdoutLogs" | "timestamp" | "stack"
>;

export type TestIssueData = {
  timestamp: string;
  overrides?: Partial<CreateIssueData>;
};

export type InsertTestIssueFn = (data: CreateIssueData) => Promise<string>;
export type InsertTestOccurrenceFn = (
  data: CraeteOccurrenceData
) => Promise<void>;

export type IsoFromNow = (offset: number) => string;
