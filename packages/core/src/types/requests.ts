import { Issue } from "./base";

export type DeleteIssues = { issueIds: Issue["id"][] };
export type ResolveIssues = { issueIds: Issue["id"][] };
export type UnresolveIssues = { issueIds: Issue["id"][] };
export type ArchiveIssues = { issueIds: Issue["id"][] };

export type IssueTab = "unresolved" | "resolved" | "archived";

export type GetIssuesFilters = {
  searchString: string;
  startDate?: string;
  endDate?: string;
  tab: IssueTab;
};

export interface GetPaginatedIssuesFilters extends GetIssuesFilters {
  page: number;
  perPage: number;
  sort: "last-seen" | "created-at" | "total-occurrences" | "relevance";
  order: "asc" | "desc";
}

export interface GetPaginatedOccurrencesFilters {
  issueId: Issue["id"];
  page: number;
  perPage: number;
  startDate: string;
  endDate: string;
}

export interface GetStats {
  startDate: string;
  endDate: string;
  timezoneOffset: number;
}
