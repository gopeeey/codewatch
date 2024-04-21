import { Issue } from "./base";

export type GetPaginatedIssuesResponse = { data: { issues: Issue[] } };

export type GetIssuesTotalResponse = { data: { total: number } };
