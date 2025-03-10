import { Issue, Occurrence, Storage } from "src/types";
import { GetTestObjectFunc } from "../types";

export interface CreateIssueData extends Omit<Issue, "id" | "resolved"> {
  resolved?: Issue["resolved"];
}

export type CreateOccurrenceData = Pick<
  Occurrence,
  "issueId" | "message" | "stderrLogs" | "stdoutLogs" | "timestamp" | "stack"
>;

export type TestIssueData = {
  timestamp: string;
  overrides?: Partial<CreateIssueData>;
};

export type InsertTestIssueFn = (data: CreateIssueData) => Promise<string>;
export type InsertTestOccurrenceFn = (
  data: CreateOccurrenceData
) => Promise<void>;

export type IsoFromNow = (offset: number) => string;

export type GetStorageFunc = GetTestObjectFunc<Storage>;
export type InsertOccurrenceFunc = (
  data: CreateOccurrenceData
) => Promise<void>;
export type InsertIssueFunc = (data: CreateIssueData) => Promise<Issue["id"]>;
