import {
  deleteIssues,
  entryPoint,
  getIssuesTotal,
  getPaginatedIssues,
  resolveIssues,
} from "./controllers";

export const apiRoutes = {
  entryPoint: {
    route: ["/"],
    method: "get",
    handler: entryPoint,
  },
  api: [
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
  ],
};
