import { AppRoutes } from "@codewatch/types";
import {
  deleteIssues,
  entryPoint,
  getIssueById,
  getIssuesTotal,
  getPaginatedIssues,
  getPaginatedOccurrences,
  resolveIssues,
  unresolveIssues,
} from "./controllers";

export const appRoutes: AppRoutes = {
  entry: {
    route: ["/", "/issues", "/statistics", "/issues/:id"],
    method: "get",
    handler: entryPoint,
  },
  api: [
    {
      route: "/api/issues",
      method: "post",
      handler: getPaginatedIssues,
    },
    {
      route: "/api/issues/:id",
      method: "get",
      handler: getIssueById,
    },
    {
      route: "/api/issues/total",
      method: "post",
      handler: getIssuesTotal,
    },
    {
      route: "/api/issues/delete",
      method: "post",
      handler: deleteIssues,
    },
    {
      route: "/api/issues/resolve",
      method: "put",
      handler: resolveIssues,
    },
    {
      route: "/api/issues/unresolve",
      method: "put",
      handler: unresolveIssues,
    },

    {
      route: "/api/occurrences",
      method: "post",
      handler: getPaginatedOccurrences,
    },
  ],
};
