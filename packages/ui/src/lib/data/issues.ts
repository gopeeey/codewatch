import {
  DeleteIssues,
  GetIssueByIdResponse,
  GetIssuesFilters,
  GetIssuesTotalResponse,
  GetPaginatedIssuesFilters,
  GetPaginatedIssuesResponse,
  Issue,
  ResolveIssues,
  UnresolveIssues,
} from "@codewatch/types";
import { HttpClient } from "@lib/http_client";

const client = new HttpClient({ baseUrl: "/issues" });
const isDev = import.meta.env.MODE === "development";

export async function getIssues(filters: GetPaginatedIssuesFilters) {
  if (isDev) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
    const emptIssues: Issue[] = [];
    if (filters.page > 1) return emptIssues;
    return issues;
  }
  const res = await client.post<
    GetPaginatedIssuesResponse["data"],
    GetPaginatedIssuesFilters
  >({
    url: "/",
    body: {
      ...filters,
      startDate: new Date(parseInt(filters.startDate as string)).toISOString(),
      endDate: new Date(parseInt(filters.endDate as string)).toISOString(),
    },
  });
  if (res.error) return null;
  return res.data.issues;
}

export async function getIssue(id: Issue["id"]) {
  if (isDev) {
    console.log("Fetching issue", id);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      fingerprint: "2345678",
      id: "2345678",
      lastOccurrenceTimestamp: "2024-05-10T13:59:33.021Z",
      lastOccurrenceMessage: "That's why this dashboard exists",
      muted: false,
      name: "It has crashed oooo!!!",
      stack:
        "Error: Something went wrong\n    at Object.<anonymous> (/home/codewatch)\n at main (c:\\Users\\Me\\Documents\\MyApp\\app.js:9:15)\n at Object. (c:\\Users\\Me\\Documents\\MyApp\\app.js:17:1)\n at Module._compile (module.js:460:26)\n at Object.Module._extensions..js (module.js:478:10)\n at Module.load (module.js:355:32)\n at Function.Module._load (module.js:310:12)\n at Function.Module.runMain (module.js:501:10)\n at startup (node.js:129:16)\n at node.js:814:3",
      totalOccurrences: 2300,
      unhandled: true,
      createdAt: "2024-04-10T13:59:33.021Z",
      resolved: false,
    };
  } else {
    const res = await client.get<GetIssueByIdResponse["data"]>(`/${id}`);
    if (res.error) return null;
    return res.data.issue;
  }
}

export async function getIssuesTotal(filters: GetIssuesFilters) {
  if (isDev) {
    if (filters.resolved) return 1230;
    return 140 as number | null;
  }

  const res = await client.post<
    GetIssuesTotalResponse["data"],
    GetIssuesFilters
  >({
    url: "/total",
    body: {
      ...filters,
      startDate: new Date(parseInt(filters.startDate as string)).toISOString(),
      endDate: new Date(parseInt(filters.endDate as string)).toISOString(),
    },
  });
  if (res.error) return null;
  return res.data.total;
}

export async function deleteIssues(issueIds: DeleteIssues["issueIds"]) {
  if (isDev) {
    return true;
  }
  const { error } = await client.post<never, DeleteIssues>({
    url: "/delete",
    body: { issueIds },
  });

  return !error;
}

export async function resolveIssues(issueIds: ResolveIssues["issueIds"]) {
  if (isDev) {
    return true;
  }
  const { error } = await client.put<never, ResolveIssues>({
    url: "/resolve",
    body: { issueIds },
  });

  return !error;
}

export async function unresolveIssues(issueIds: ResolveIssues["issueIds"]) {
  if (isDev) {
    return true;
  }
  const { error } = await client.put<never, UnresolveIssues>({
    url: "/unresolve",
    body: { issueIds },
  });

  return !error;
}
