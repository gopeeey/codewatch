import { Issue, Occurrence } from "./base";

export type GetPaginatedIssuesResponse = { data: { issues: Issue[] } };

export type GetIssuesTotalResponse = { data: { total: number } };

export type GetPaginatedOccurrencesResponse = {
  data: { occurrences: Occurrence[] };
};

export type GetIssueByIdResponse = { data: { issue: Issue } };

type DailyIssueCount = { date: string; count: number };

export type StatsData = {
  data: {
    stats: {
      totalIssues: number;
      dailyIssueCounts: DailyIssueCount[];
      manuallyCapturedIssuesRate: number;
      unhandledIssuesRate: number;
      mostRecurringIssues: Issue[];
    };
  };
};
