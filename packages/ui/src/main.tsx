import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import routes from "./routes";
const basePath =
  document.head.querySelector("base")?.getAttribute("href") || "";
const router = createBrowserRouter(routes, { basename: basePath });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
