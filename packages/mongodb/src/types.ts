import { Issue } from "codewatch-core/dist/types";

export interface DbIssue
  extends Omit<Issue, "lastOccurrenceTimestamp" | "createdAt"> {
  lastOccurrenceTimestamp: Date;
  createdAt: Date;
}
