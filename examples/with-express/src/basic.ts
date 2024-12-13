import { captureError, init } from "codewatch-core";
import { ExpressAdapter } from "codewatch-express";
import { CodewatchPgStorage } from "codewatch-postgres";
import express from "express";

const app = express();

// Initialize the storage plugin with the database credentials
const storage = new CodewatchPgStorage({
  user: "USER_NAME",
  host: "HOST",
  database: "DATABASE_NAME",
  password: "DATABASE_PASSWORD",
  port: 5432, // Please replace all these details with your actual details.
});

// Initialize the express adapter and set a base path
const basePath = "/code";
const adapter = new ExpressAdapter();
adapter.setBasePath(basePath);

// Initialize codewatch with the storage plugin and the adapter
init({
  storage,
  serverAdapter: adapter,
});

// Add a middleware on the specified base path to access the dashboard
const router = adapter.getRouter();
app.use(basePath, router);

app.get("/test", (req, res) => {
  try {
    throw new Error("This is a test error");
  } catch (err) {
    captureError(err);
    res.json({ message: "done" });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Dashboard available at http://localhost:${port}${basePath}`);
});
