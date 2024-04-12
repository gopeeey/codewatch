import { RouteObject } from "react-router-dom";
import IssuesRoute from "./issues";
import Layout from "./layout";
import StatisticsRoute from "./statistics";

const routes: RouteObject[] = [
  {
    Component: Layout,
    children: [
      {
        path: "/",
        Component: IssuesRoute,
      },
      {
        path: "/statistics",
        Component: StatisticsRoute,
      },
    ],
  },
];

export default routes;
