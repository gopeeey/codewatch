import { RouteObject } from "react-router-dom";
import IssueDetails from "./issue_details";
import IssuesRoute from "./issues";
import Layout from "./layout";
import StatisticsRoute from "./statistics";

const routes: RouteObject[] = [
  {
    Component: Layout,
    children: [
      {
        path: "/",
        Component: () => null,
      },
      {
        path: "/issues",
        Component: IssuesRoute,
      },
      {
        path: "/statistics",
        Component: StatisticsRoute,
      },
      {
        path: "/issues/:id",
        Component: IssueDetails,
      },
    ],
  },
];

export default routes;
