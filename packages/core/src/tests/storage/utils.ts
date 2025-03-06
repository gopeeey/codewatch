import { CreateIssueData } from "src/tests/storage/types";
import { Issue } from "src/types";

export const createCreateIssueData = (
  timestamp: string,
  overrides?: Partial<Omit<Issue, "id">>
) => {
  const issue: CreateIssueData = {
    fingerprint: "123456789012345678",
    lastOccurrenceTimestamp: timestamp,
    createdAt: timestamp,
    lastOccurrenceMessage: "",
    archived: false,
    totalOccurrences: 1,
    unhandled: false,
    name: "Error 1",
    isLog: false,
    ...overrides,
  };
  return issue;
};
