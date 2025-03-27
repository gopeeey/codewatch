import { Document } from "mongoose";
import { DbIssue, DbOccurrence } from "./types";

export function docIssueToIssue(doc: Document<unknown, {}, DbIssue>) {
  const json = doc.toJSON();
  return {
    ...json,
    lastOccurrenceTimestamp: json.lastOccurrenceTimestamp?.toISOString(),
    createdAt: json.createdAt?.toISOString(),
  };
}

export function dbIssueToIssue(dbIssue: DbIssue) {
  return {
    ...dbIssue,
    lastOccurrenceTimestamp: dbIssue.lastOccurrenceTimestamp?.toISOString(),
    createdAt: dbIssue.createdAt?.toISOString(),
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
