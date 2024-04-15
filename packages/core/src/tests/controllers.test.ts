import fs from "fs";
import {
  deleteIssues,
  entryPoint,
  errorHandler,
  getIssuesTotal,
  getPaginatedIssues,
  resolveIssues,
} from "../controllers";
import { Core } from "../core";
import { GetIssuesFilters, GetPaginatedIssuesFilters } from "../types";
import { MockStorage } from "./mock_storage";

const testError = new Error("Hello world");

beforeEach(() => {
  MockStorage.createInstance();
  const storage = MockStorage.getInstance();
  Core.init(storage, { disableConsoleLogs: false });
  Core.handleError(testError);
});

afterEach(async () => {
  await Core.close();
});

describe("getPaginatedIssues", () => {
  it("should return a 200 and an array of issues", async () => {
    const filters: GetPaginatedIssuesFilters = {
      resolved: false,
      searchString: "something",
      page: 1,
      perPage: 10,
    };

    const storage = MockStorage.getInstance();
    const response = await getPaginatedIssues(
      { body: filters, query: {}, params: {} },
      { storage }
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: { issues: storage.issues } });
  });
});

describe("getIssuesTotal", () => {
  it("should return a 200 and a number representing total number of issues for that filter", async () => {
    const filters: GetIssuesFilters = {
      resolved: false,
      searchString: "something",
    };
    const storage = MockStorage.getInstance();
    const response = await getIssuesTotal(
      { body: filters, query: {}, params: {} },
      { storage }
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: { total: storage.issues.length } });
  });
});

describe("deleteIssues", () => {
  it("should delete the given issues from the storage", async () => {
    const storage = MockStorage.getInstance();
    expect(storage.issues).toHaveLength(1);

    await deleteIssues(
      { body: { issueIds: ["1"] }, query: {}, params: {} },
      { storage }
    );
    expect(storage.issues).toHaveLength(0);
  });
});

describe("resolveIssues", () => {
  it("should call storage.resolveIssues", async () => {
    const storage = MockStorage.getInstance();
    expect(storage.issues[0].resolved).toBe(false);
    await resolveIssues(
      { body: { issueIds: ["1"] }, query: {}, params: {} },
      { storage }
    );
    expect(storage.issues[0].resolved).toBe(true);
  });
});

describe("errorHandler", () => {
  it("should return a 500 and an error message", () => {
    const error = new Error("Hello world");
    const response = errorHandler(error);
    expect(response).toEqual({
      message: "Internal server error",
      errorMessage: error.message,
      stack: error.stack,
    });
  });
});

describe("entryPoint", () => {
  it("should return a 200 and a file", async () => {
    const url = "/someurl";

    const readFileSpy = jest.spyOn(fs, "readFile");
    readFileSpy.mockImplementationOnce(
      (...args: Parameters<(typeof fs)["readFile"]>) => {
        const [path, callback] = args;
        callback(null, Buffer.from("{{>basePath}} hello there"));
      }
    );

    const response = entryPoint(url);
    expect(response).toEqual({
      name: "index.ejs",
      params: { basePath: url + "/" },
    });
  });
});
