import fs from "fs";
import {
  deleteIssues,
  entryPoint,
  errorHandler,
  getIssuesTotal,
  getPaginatedIssues,
  resolveIssues,
} from "../controllers";
import { GetIssuesFilters, GetPaginatedIssuesFilters, Storage } from "../types";
import { testIssueArray } from "./samples";

const storageMock: {
  [key in keyof Pick<
    Storage,
    "getPaginatedIssues" | "getIssuesTotal" | "deleteIssues" | "resolveIssues"
  >]: jest.Mock;
} = {
  getPaginatedIssues: jest.fn(),
  getIssuesTotal: jest.fn(),
  deleteIssues: jest.fn(),
  resolveIssues: jest.fn(),
};

const storage = storageMock as unknown as Storage;

describe("getPaginatedIssues", () => {
  it("should return a 200 and an array of issues", async () => {
    storageMock.getPaginatedIssues.mockResolvedValue(testIssueArray);
    const filters: GetPaginatedIssuesFilters = {
      resolved: false,
      searchString: "something",
      page: 1,
      perPage: 10,
    };
    const response = await getPaginatedIssues(
      { body: filters, query: {}, params: {} },
      { storage }
    );
    expect(storageMock.getPaginatedIssues).toHaveBeenCalledWith(filters);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: { issues: testIssueArray } });
  });
});

describe("getIssuesTotal", () => {
  it("should return a 200 and a number representing total number of issues for that filter", async () => {
    storageMock.getIssuesTotal.mockResolvedValue(3);
    const filters: GetIssuesFilters = {
      resolved: false,
      searchString: "something",
    };
    const response = await getIssuesTotal(
      { body: filters, query: {}, params: {} },
      { storage }
    );
    expect(storageMock.getIssuesTotal).toHaveBeenCalledWith(filters);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: { total: 3 } });
  });
});

describe("deleteIssues", () => {
  it("should call storage.deleteIssues", async () => {
    const ids = ["1", "2", "3"];
    await deleteIssues(
      { body: { issueIds: ids }, query: {}, params: {} },
      { storage }
    );
    expect(storageMock.deleteIssues).toHaveBeenCalledWith(ids);
  });
});

describe("resolveIssues", () => {
  it("should call storage.resolveIssues", async () => {
    const ids = ["1", "2", "3"];
    await resolveIssues(
      { body: { issueIds: ids }, query: {}, params: {} },
      { storage }
    );
    expect(storageMock.resolveIssues).toHaveBeenCalledWith(ids);
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
