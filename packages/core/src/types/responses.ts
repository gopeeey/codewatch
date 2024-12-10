import { Issue, Occurrence, StatsData } from "./base";

export type GetPaginatedIssuesResponse = { data: { issues: Issue[] } };

export type GetIssuesTotalResponse = { data: { total: number } };

export type GetPaginatedOccurrencesResponse = {
  data: { occurrences: Occurrence[] };
};

export type GetIssueByIdResponse = { data: { issue: Issue } };

export type GetStatsResponse = {
  data: {
    stats: StatsData;
  };
};
