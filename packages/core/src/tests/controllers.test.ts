import {
  GetIssuesFilters,
  GetPaginatedIssuesFilters,
  GetPaginatedOccurrencesFilters,
} from "@codewatch/types";
import fs from "fs";
import {
  archiveIssues,
  deleteIssues,
  entryPoint,
  errorHandler,
  getIssueById,
  getIssuesTotal,
  getPaginatedIssues,
  getPaginatedOccurrences,
  resolveIssues,
  unarchiveIssues,
  unresolveIssues,
} from "../controllers";
import { Core } from "../core";
import { MockStorage } from "./mock_storage";
import { testIssueArray } from "./samples";

const testError = new Error("Hello world");

beforeEach(async () => {
  MockStorage.createInstance();
  const storage = MockStorage.getInstance();
  Core.init(storage, { disableConsoleLogs: false });
  await Core.captureError(testError);
});

afterEach(async () => {
  await Core.close();
});

describe("getPaginatedIssues", () => {
  it("should return a 200 and an array of issues", async () => {
    const filters: GetPaginatedIssuesFilters = {
      tab: "unresolved",
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

describe("getPaginatedOccurrences", () => {
  it("should return a 200 and an array of occurrences", async () => {
    const filters: GetPaginatedOccurrencesFilters = {
      startDate: "2020-01-01",
      endDate: "2020-01-01",
      issueId: "1",
      page: 1,
      perPage: 10,
    };

    const storage = MockStorage.getInstance();
    const response = await getPaginatedOccurrences(
      { body: filters, query: {}, params: {} },
      { storage }
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: { occurrences: storage.occurrences },
    });
  });
});

describe("getIssueById", () => {
  it("should return a 200 and an issue object", async () => {
    const storage = MockStorage.getInstance();
    storage.issues = testIssueArray;
    const response = await getIssueById(
      { params: { id: testIssueArray[0].id }, body: {}, query: {} },
      { storage }
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: { issue: testIssueArray[0] } });
  });
});

describe("getIssuesTotal", () => {
  it("should return a 200 and a number representing total number of issues for that filter", async () => {
    const filters: GetIssuesFilters = {
      tab: "unresolved",
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

describe("unresolveIssues", () => {
  it("should call storage.unresolveIssues", async () => {
    const storage = MockStorage.getInstance();
    storage.issues[0].resolved = true;
    await unresolveIssues(
      { body: { issueIds: ["1"] }, query: {}, params: {} },
      { storage }
    );
    expect(storage.issues[0].resolved).toBe(false);
  });
});

describe("archiveIssues", () => {
  it("should call storage.archiveIssues", async () => {
    const storage = MockStorage.getInstance();
    storage.issues[0].archived = false;
    await archiveIssues(
      { body: { issueIds: ["1"] }, query: {}, params: {} },
      { storage }
    );
    expect(storage.issues[0].archived).toBe(true);
  });
});

describe("unarchiveIssues", () => {
  it("should call storage.unarchiveIssues", async () => {
    const storage = MockStorage.getInstance();
    storage.issues[0].archived = true;
    await unarchiveIssues(
      { body: { issueIds: ["1"] }, query: {}, params: {} },
      { storage }
    );
    expect(storage.issues[0].archived).toBe(false);
  });
});

describe("errorHandler", () => {
  it("should return a 500 and an error message", () => {
    const error = new Error("Hello world");
    const response = errorHandler(error);
    expect(response).toEqual({
      status: 500,
      body: {
        message: "Internal server error",
        data: { errorMessage: error.message, stack: error.stack },
      },
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
