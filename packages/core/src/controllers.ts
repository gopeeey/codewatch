import { ApiController, GetPaginatedIssuesFilters, Issue } from "./types";

export const getPaginatedIssues: ApiController<
  GetPaginatedIssuesFilters,
  null,
  null,
  Issue[]
> = async (req, storage) => {
  const issues = await storage.getPaginatedIssues(req.body);
  return { status: 200, body: issues };
};
