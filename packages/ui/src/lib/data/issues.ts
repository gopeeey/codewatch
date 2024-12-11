import { HttpClient } from "@lib/http_client";
import {
  ArchiveIssues,
  DeleteIssues,
  GetIssueByIdResponse,
  GetIssuesFilters,
  GetIssuesTotalResponse,
  GetPaginatedIssuesFilters,
  GetPaginatedIssuesResponse,
  GetStats,
  GetStatsResponse,
  Issue,
  ResolveIssues,
  UnresolveIssues,
} from "codewatch-core/dist/types";
import moment from "moment";

const client = new HttpClient({ baseUrl: "/issues" });
const isDev = import.meta.env.MODE === "development";

const testIssues: Issue[] = [
  {
    fingerprint: "123456789",
    id: "123456789",
    lastOccurrenceTimestamp: "2024-04-10T13:59:33.021Z",
    lastOccurrenceMessage:
      "It went terribly wrong, I don't even know what happened.",
    archived: false,
    name: "Something went wrong",
    totalOccurrences: 3245,
    unhandled: false,
    createdAt: "2024-04-10T13:59:33.021Z",
    resolved: false,
    isLog: false,
  },
  {
    fingerprint: "2345678",
    id: "2345678",
    lastOccurrenceTimestamp: "2024-04-10T13:59:33.021Z",
    lastOccurrenceMessage: "That's why this dashboard exists",
    archived: false,
    name: "It has crashed oooo!!!",
    totalOccurrences: 230,
    unhandled: true,
    createdAt: "2024-04-10T13:59:33.021Z",
    resolved: false,
    isLog: false,
  },
  {
    fingerprint: "34567890",
    id: "34567890",
    lastOccurrenceTimestamp: "2024-04-10T13:59:33.021Z",
    lastOccurrenceMessage: "You'll find what it is though",
    archived: false,
    name: "Something went really wrong",
    totalOccurrences: 234,
    unhandled: false,
    createdAt: "2024-04-10T13:59:33.021Z",
    resolved: false,
    isLog: false,
  },
];

export async function getIssues(filters: GetPaginatedIssuesFilters) {
  if (isDev) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (filters.page > 1) return [] as Issue[];
    return testIssues;
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const testIssue: Issue = {
      fingerprint: "2345678",
      id: "2345678",
      lastOccurrenceTimestamp: "2024-05-10T13:59:33.021Z",
      lastOccurrenceMessage: "That's why this dashboard exists",
      archived: false,
      name: "It has crashed oooo!!!",
      totalOccurrences: 2300,
      unhandled: true,
      createdAt: "2024-04-10T13:59:33.021Z",
      resolved: false,
      isLog: false,
    };
    return testIssue;
  } else {
    const res = await client.get<GetIssueByIdResponse["data"]>(`/${id}`);
    if (res.error) return null;
    return res.data.issue;
  }
}

export async function getIssuesTotal(filters: GetIssuesFilters) {
  if (isDev) {
    if (filters.tab === "resolved") return 1230;
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
    await new Promise((resolve) => setTimeout(resolve, 2000));
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  }
  const { error } = await client.put<never, UnresolveIssues>({
    url: "/unresolve",
    body: { issueIds },
  });

  return !error;
}

export async function archiveIssues(issueIds: ArchiveIssues["issueIds"]) {
  if (isDev) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  }
  const { error } = await client.put<never, ArchiveIssues>({
    url: "/archive",
    body: { issueIds },
  });

  return !error;
}

export async function unarchiveIssues(issueIds: ArchiveIssues["issueIds"]) {
  if (isDev) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  }
  const { error } = await client.put<never, ArchiveIssues>({
    url: "/unarchive",
    body: { issueIds },
  });

  return !error;
}

export async function getStats(filter: GetStats) {
  if (isDev) {
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    const defaultData: GetStatsResponse["data"]["stats"] = {
      totalIssues: 2300,
      totalOccurrences: 1450050,
      dailyOccurrenceCount: [
        { date: new Date("2024-04-10").toISOString(), count: 10 },
        { date: new Date("2024-04-11").toISOString(), count: 40 },
        { date: new Date("2024-04-12").toISOString(), count: 98 },
        { date: new Date("2024-04-13").toISOString(), count: 200 },
        { date: new Date("2024-04-14").toISOString(), count: 50 },
        { date: new Date("2024-04-15").toISOString(), count: 1300 },
        { date: new Date("2024-04-16").toISOString(), count: 16 },
        { date: new Date("2024-04-17").toISOString(), count: 78 },
      ],
      dailyUnhandledOccurrenceCount: [
        { date: new Date("2024-04-10").toISOString(), count: 7 },
        { date: new Date("2024-04-11").toISOString(), count: 30 },
        { date: new Date("2024-04-12").toISOString(), count: 56 },
        { date: new Date("2024-04-13").toISOString(), count: 123 },
        { date: new Date("2024-04-14").toISOString(), count: 45 },
        { date: new Date("2024-04-15").toISOString(), count: 454 },
        { date: new Date("2024-04-16").toISOString(), count: 12 },
        { date: new Date("2024-04-17").toISOString(), count: 22 },
      ],
      totalManuallyCapturedOccurrences: 76,
      totalUnhandledOccurrences: 24,
      totalLoggedData: 34,
      mostRecurringIssues: testIssues,
    };
    return defaultData;
  }

  const startDateString = new Date(parseInt(filter.startDate)).toISOString();
  const endDateString = new Date(parseInt(filter.endDate)).toISOString();
  const res = await client.post<GetStatsResponse["data"], GetStats>({
    url: "/stats",
    body: {
      startDate: startDateString,
      endDate: endDateString,
      timezoneOffset: filter.timezoneOffset,
    },
  });
  if (res.error) return null;

  const fillOccurrenceDates = (
    field: "dailyOccurrenceCount" | "dailyUnhandledOccurrenceCount"
  ) => {
    let index = 0;
    const current = moment(startDateString);
    const end = moment(endDateString);
    current.set("hour", 0);
    current.set("minute", 0);
    current.set("second", 0);
    current.set("millisecond", 0);
    end.set("hour", 0);
    end.set("minute", 0);
    end.set("second", 0);
    end.set("millisecond", 0);
    const occurrences = res.data.stats[field];
    const newOccurrences: GetStatsResponse["data"]["stats"]["dailyOccurrenceCount"] =
      [];

    while (current.isSameOrBefore(end)) {
      const dateString = current.format("YYYY-MM-DD");
      console.log(dateString);
      if (occurrences[index] && occurrences[index].date === dateString) {
        newOccurrences.push(occurrences[index]);
        index++;
      } else {
        newOccurrences.push({ date: dateString, count: 0 });
      }

      current.add(1, "day");
    }

    res.data.stats[field] = newOccurrences;
  };

  fillOccurrenceDates("dailyOccurrenceCount");
  fillOccurrenceDates("dailyUnhandledOccurrenceCount");

  return res.data.stats;
}
