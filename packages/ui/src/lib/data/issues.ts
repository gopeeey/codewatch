import { Issue } from "@codewatch/core";

export type GetIssuesFilters = {
  searchString: string;
  startDate: string;
  endDate: string;
  page: number;
  perPage: number;
  resolved: "resolved" | "unresolved";
};
export async function getIssues(filters: GetIssuesFilters) {
  if (!filters.startDate.length || !filters.endDate.length)
    return { issues: [], resolvedCount: 0, unresolvedCount: 0 };
  console.log("Filters", filters);
  const issues: Issue[] = [
    {
      fingerprint: "123456789",
      id: "123456789",
      lastOccurrenceTimestamp: "2024-04-10T13:59:33.021Z",
      lastOccurrenceMessage:
        "It went terribly wrong, I don't even know what happened.",
      muted: false,
      name: "Something went wrong",
      stack:
        "Error: Something went wrong\n    at Object.<anonymous> (/home/codewatch)",
      totalOccurrences: 3245,
      unhandled: false,
      createdAt: "2024-04-10T13:59:33.021Z",
      resolved: false,
    },
    {
      fingerprint: "2345678",
      id: "2345678",
      lastOccurrenceTimestamp: "2024-04-10T13:59:33.021Z",
      lastOccurrenceMessage: "That's why this dashboard exists",
      muted: false,
      name: "It has crashed oooo!!!",
      stack:
        "Error: Something went wrong\n    at Object.<anonymous> (/home/codewatch)",
      totalOccurrences: 230,
      unhandled: true,
      createdAt: "2024-04-10T13:59:33.021Z",
      resolved: false,
    },
    {
      fingerprint: "34567890",
      id: "34567890",
      lastOccurrenceTimestamp: "2024-04-10T13:59:33.021Z",
      lastOccurrenceMessage: "You'll find what it is though",
      muted: false,
      name: "Something went really wrong",
      stack:
        "Error: Something went wrong\n    at Object.<anonymous> (/home/codewatch)",
      totalOccurrences: 234,
      unhandled: false,
      createdAt: "2024-04-10T13:59:33.021Z",
      resolved: false,
    },
  ];
  return { issues, resolvedCount: 1200, unresolvedCount: 3 };
}
