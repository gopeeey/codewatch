import {
  deleteIssues,
  getIssuesTotal,
  getPaginatedIssues,
  resolveIssues,
} from "./controllers";
import { ApiRoute } from "./types";

export const apiRoutes: ApiRoute[] = [
  {
    route: "/api/issues",
    method: "get",
    handler: getPaginatedIssues,
  },
  {
    route: "/api/issues/total",
    method: "get",
    handler: getIssuesTotal,
  },
  {
    route: "/api/issues/delete",
    method: "delete",
    handler: deleteIssues,
  },
  {
    route: "/api/issues/resolve",
    method: "put",
    handler: resolveIssues,
  },
];
