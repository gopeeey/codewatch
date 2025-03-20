import { Document } from "mongoose";
import { DbIssue, DbOccurrence } from "./types";

export function dbIssueToIssue(dbIssue: Document<unknown, {}, DbIssue>) {
  const json = dbIssue.toJSON();
  return {
    ...json,
    lastOccurrenceTimestamp: json.lastOccurrenceTimestamp.toISOString(),
    createdAt: json.createdAt.toISOString(),
  };
}

export function dbOccurrenceToOccurrence(
  dbOccurrence: Document<unknown, {}, DbOccurrence>
) {
  const json = dbOccurrence.toJSON();
  return {
    ...json,
    timestamp: json.timestamp.toISOString(),
  };
}
