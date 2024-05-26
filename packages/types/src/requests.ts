import { Issue } from "./base";

export type DeleteIssues = { issueIds: Issue["id"][] };
export type ResolveIssues = { issueIds: Issue["id"][] };
export type UnresolveIssues = { issueIds: Issue["id"][] };

export type GetIssuesFilters = {
  searchString: string;
  startDate?: string;
  endDate?: string;
  resolved: boolean;
};

export interface GetPaginatedIssuesFilters extends GetIssuesFilters {
  page: number;
  perPage: number;
}

export interface GetPaginatedOccurrencesFilters {
  issueId: Issue["id"];
  page: number;
  perPage: number;
  startDate: string;
  endDate: string;
}
