import { Issue, Occurrence } from "./base";

export type GetPaginatedIssuesResponse = { data: { issues: Issue[] } };

export type GetIssuesTotalResponse = { data: { total: number } };

export type GetPaginatedOccurrencesResponse = {
  data: { occurrences: Occurrence[] };
};

export type GetIssueByIdResponse = { data: { issue: Issue } };

type DailyOccurrenceCount = { date: string; count: number };

export type GetStatsResponse = {
  data: {
    stats: {
      totalIssues: number;
      totalOccurrences: number;
      dailyOccurrenceCount: DailyOccurrenceCount[];
      dailyUnhandledOccurrenceCount: DailyOccurrenceCount[];
      totalUnhandledOccurrences: number;
      totalManuallyCapturedOccurrences: number;
      totalLoggedData: number;
      mostRecurringIssues: Issue[];
    };
  };
};
