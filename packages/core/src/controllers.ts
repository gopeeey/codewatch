import {
  Controller,
  ErrorHandler,
  GetIssuesFilters,
  GetPaginatedIssuesFilters,
  Issue,
  ViewController,
} from "@codewatch/types";

export const getPaginatedIssues: Controller = async (req, deps) => {
  const issues = await deps.storage.getPaginatedIssues(
    req.body as unknown as GetPaginatedIssuesFilters
  );
  return { status: 200, body: { data: { issues } } };
};

export const getIssuesTotal: Controller = async (req, deps) => {
  const total = await deps.storage.getIssuesTotal(
    req.body as unknown as GetIssuesFilters
  );
  return { status: 200, body: { data: { total } } };
};

export const deleteIssues: Controller = async (req, deps) => {
  await deps.storage.deleteIssues(
    req.body.issueIds as unknown as Issue["id"][]
  );
  return { status: 200 };
};

export const resolveIssues: Controller = async (req, deps) => {
  await deps.storage.resolveIssues(
    req.body.issueIds as unknown as Issue["id"][]
  );
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
