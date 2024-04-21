import {
  Controller,
  DeleteIssues,
  ErrorHandler,
  GetIssuesFilters,
  GetIssuesTotalResponse,
  GetPaginatedIssuesFilters,
  GetPaginatedIssuesResponse,
  ResolveIssues,
  ViewController,
} from "@codewatch/types";

export const getPaginatedIssues: Controller<
  GetPaginatedIssuesResponse,
  GetPaginatedIssuesFilters
> = async (req, deps) => {
  const issues = await deps.storage.getPaginatedIssues(req.body);
  return { status: 200, body: { data: { issues } } };
};

export const getIssuesTotal: Controller<
  GetIssuesTotalResponse,
  GetIssuesFilters
> = async (req, deps) => {
  const total = await deps.storage.getIssuesTotal(req.body);
  return { status: 200, body: { data: { total } } };
};

export const deleteIssues: Controller<never, DeleteIssues> = async (
  req,
  deps
) => {
  await deps.storage.deleteIssues(req.body.issueIds);
  return { status: 200 };
};

export const resolveIssues: Controller<never, ResolveIssues> = async (
  req,
  deps
) => {
  await deps.storage.resolveIssues(req.body.issueIds);
  return { status: 200 };
};

export const unresolveIssues: Controller<never, ResolveIssues> = async (
  req,
  deps
) => {
  await deps.storage.unresolveIssues(req.body.issueIds);
  return { status: 200 };
};

export const errorHandler: ErrorHandler = (error) => {
  let errorMessage = "",
    stack = "";
  if (error instanceof Error) {
    errorMessage = error.message;
    if (error.stack) stack = error.stack;
  }
  return {
    status: 500,
    body: { message: "Internal server error", data: { errorMessage, stack } },
  };
};

export const entryPoint: ViewController = (basePath) => {
  return {
    name: "index.ejs",
    params: {
      basePath: basePath.endsWith("/") ? basePath : basePath + "/",
    },
  };
};
