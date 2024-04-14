import {
  Controller,
  GetIssuesFilters,
  GetPaginatedIssuesFilters,
  Issue,
} from "./types";

export const getPaginatedIssues: Controller<
  GetPaginatedIssuesFilters,
  {},
  {},
  { issues: Issue[] }
> = async (req, storage) => {
  const issues = await storage.getPaginatedIssues(req.body);
  return { status: 200, body: { data: { issues } } };
};

export const getIssuesTotal: Controller<
  GetIssuesFilters,
  {},
  {},
  { total: number }
> = async (req, storage) => {
  const total = await storage.getIssuesTotal(req.body);
  return { status: 200, body: { data: { total } } };
};

export const deleteIssues: Controller<{ issueIds: Issue["id"][] }> = async (
  req,
  storage
) => {
  await storage.deleteIssues(req.body.issueIds);
  return { status: 200 };
};

export const resolveIssues: Controller<{ issueIds: Issue["id"][] }> = async (
  req,
  storage
) => {
  await storage.resolveIssues(req.body.issueIds);
  return { status: 200 };
};
