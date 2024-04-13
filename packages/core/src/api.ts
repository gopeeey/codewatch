import {
  ApiRoute,
  GetIssuesFilters,
  GetPaginatedIssuesFilters,
  Issue,
  Storage,
} from "./types";

export class Api {
  constructor(private _storage: Storage) {}

  routes: ApiRoute[] = [];

  async getPaginatedIssues(filters: GetPaginatedIssuesFilters) {
    return await this._storage.getPaginatedIssues(filters);
  }

  async getIssuesTotal(filters: GetIssuesFilters) {
    return await this._storage.getIssuesTotal(filters);
  }

  async deleteIssues(issueIds: Issue["id"][]) {
    await this._storage.deleteIssues(issueIds);
  }
  async resolveIssues(issueIds: Issue["id"][]) {
    await this._storage.resolveIssues(issueIds);
  }
}
