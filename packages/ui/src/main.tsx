import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import routes from "./routes";

declare global {
  interface Window {
    __basePath__: string;
  }
}
const basePath = (window.__basePath__ =
  document.head.querySelector("base")?.getAttribute("href") || "/");
console.log("\n\n\nBASE PATH:", basePath);
const router = createBrowserRouter(routes, {
  basename: basePath.endsWith("/") ? basePath.slice(0, -1) : basePath,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
