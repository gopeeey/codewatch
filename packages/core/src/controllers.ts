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

export const errrorHandler: Controller<
  { error: unknown },
  {},
  {},
  { message: string }
> = async (req) => {
  let errorMessage = "",
    stack = "";
  if (req.body.error instanceof Error) {
    errorMessage = req.body.error.message;
    if (req.body.error.stack) stack = req.body.error.stack;
  }
  return {
    status: 500,
    body: { message: "Internal server error", errorMessage, stack },
  };
};
