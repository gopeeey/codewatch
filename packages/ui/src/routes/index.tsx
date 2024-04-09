import { RouteObject } from "react-router-dom";
import IssuesRoute from "./issues";
import MainLayout from "./main_layout";
import StatisticsRoute from "./statistics";

const routes: RouteObject[] = [
  {
    Component: MainLayout,
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
