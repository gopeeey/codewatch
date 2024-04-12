import { GetPaginatedIssuesFilters, Storage } from "./types";

export class Api {
  constructor(private _storage: Storage) {}

  async getPaginatedIssues(filters: GetPaginatedIssuesFilters) {
    return await this._storage.getPaginatedIssues(filters);
  }
}
