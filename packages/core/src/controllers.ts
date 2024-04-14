import fs from "fs";
import path from "path";
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

export const errorHandler: Controller<
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

export const entryPoint: Controller<
  { uiPath: string; url: string },
  {},
  {},
  { file: string; send: boolean }
> = async (req) => {
  const { uiPath, url } = req.body;

  const filePath = path.join(uiPath, "index.html");
  let file = await new Promise<string>((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) reject(err);
      else resolve(data.toString());
    });
  });
  file = file.replace("{{>basePath}}", url);

  return {
    status: 200,
    body: { data: { file, send: true } },
  };
};
