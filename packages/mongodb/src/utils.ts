import { Document } from "mongoose";
import { DbIssue } from "./types";

export function dbIssueToIssue(dbIssue: Document<unknown, {}, DbIssue>) {
  const json = dbIssue.toJSON();
  return {
    ...json,
    lastOccurrenceTimestamp: json.lastOccurrenceTimestamp.toISOString(),
    createdAt: json.createdAt.toISOString(),
  };
}
