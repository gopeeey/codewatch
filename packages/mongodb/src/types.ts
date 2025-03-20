import { Issue, Occurrence } from "codewatch-core/dist/types";

export interface DbIssue
  extends Omit<Issue, "lastOccurrenceTimestamp" | "createdAt"> {
  lastOccurrenceTimestamp: Date;
  createdAt: Date;
}

export interface DbOccurrence extends Omit<Occurrence, "timestamp"> {
  timestamp: Date;
}
