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

export function docOccurrenceToOccurrence(
  dbOccurrence: Document<unknown, {}, DbOccurrence>
) {
  const json = dbOccurrence.toJSON();
  return {
    ...json,
    timestamp: json.timestamp.toISOString(),
  };
}

export function dbOccurrenceToOccurrence(dbOccurrence: DbOccurrence) {
  return {
    ...dbOccurrence,
    timestamp: dbOccurrence.timestamp.toISOString(),
  };
}

export function getTimezoneString(offset: number): string {
  const sign = offset >= 0 ? "+" : "-";
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset / 60);
  const minutes = absOffset % 60;
  return `${sign}${hours.toString().padStart(2, "0")}${minutes
    .toString()
    .padStart(2, "0")}`;
}
