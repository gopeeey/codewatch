import { HttpClient } from "@lib/http_client";
import { getIsDev } from "@lib/utils";
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
import { issues as testIssues } from "./examples";

const client = new HttpClient({ baseUrl: "/issues" });
const isDev = getIsDev();

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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return testIssues.filter((issue) => issue.id === id)[0];
  } else {
    const res = await client.get<GetIssueByIdResponse["data"]>(`/${id}`);
    if (res.error) return null;
    return res.data.issue;
  }
}

export async function getIssuesTotal(filters: GetIssuesFilters) {
  if (isDev) return testIssues.length;

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
      mostRecurringIssues: testIssues.slice(0, 5),
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
