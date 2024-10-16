import { Issue } from "@codewatch/types";

export const testIssue: Issue = {
  createdAt: "2020-01-01T00:00:0",
  fingerprint: "wlekjflkwj34",
  id: "12345",
  lastOccurrenceMessage: "Something happened",
  lastOccurrenceTimestamp: "2020-01-01T00:00:0",
  archived: false,
  name: "Something",
  stack: "\n Somewhere (index.js:123)",
  totalOccurrences: 20,
  unhandled: false,
  resolved: false,
  isLog: false,
};
export const testIssueArray = [testIssue, testIssue, testIssue];
