import {
  Controller,
  DeleteIssues,
  ErrorHandler,
  GetIssueByIdResponse,
  GetIssuesFilters,
  GetIssuesTotalResponse,
  GetPaginatedIssuesFilters,
  GetPaginatedIssuesResponse,
  GetPaginatedOccurrencesFilters,
  GetPaginatedOccurrencesResponse,
  GetStats,
  GetStatsResponse,
  ResolveIssues,
  ViewController,
} from "@codewatch/types";

class NonInternalError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "NonInternalError";
    this.status = status;
  }
}

export const getPaginatedIssues: Controller<
  GetPaginatedIssuesResponse,
  GetPaginatedIssuesFilters
> = async (req, deps) => {
  const issues = await deps.storage.getPaginatedIssues(req.body);
  return { status: 200, body: { data: { issues } } };
};

export const getPaginatedOccurrences: Controller<
  GetPaginatedOccurrencesResponse,
  GetPaginatedOccurrencesFilters
> = async (req, deps) => {
  const occurrences = await deps.storage.getPaginatedOccurrences(req.body);
  return { status: 200, body: { data: { occurrences } } };
};

export const getIssueById: Controller<
  GetIssueByIdResponse,
  {},
  {},
  { id: string }
> = async (req, deps) => {
  const issue = await deps.storage.findIssueById(req.params.id);
  if (!issue) throw new NonInternalError(`Issue not found`, 404);
  return { status: 200, body: { data: { issue } } };
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

export const archiveIssues: Controller<never, ResolveIssues> = async (
  req,
  deps
) => {
  await deps.storage.archiveIssues(req.body.issueIds);
  return { status: 200 };
};

export const unarchiveIssues: Controller<never, ResolveIssues> = async (
  req,
  deps
) => {
  await deps.storage.unarchiveIssues(req.body.issueIds);
  return { status: 200 };
};

export const getStatsData: Controller<GetStatsResponse, GetStats> = async (
  req,
  deps
) => {
  const stats = await deps.storage.getStatsData(req.body);
  return { status: 200, body: { data: { stats } } };
};

export const errorHandler: ErrorHandler = (error) => {
  let errorMessage = "",
    userMessage = "Internal server error",
    status = 500,
    stack = "";
  if (error instanceof Error) {
    if (error instanceof NonInternalError) {
      userMessage = error.message;
      status = error.status;
    } else {
      errorMessage = error.message;
      if (error.stack) stack = error.stack;
    }
  }
  return {
    status,
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
