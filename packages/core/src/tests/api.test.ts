import { Api } from "../api";
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

const api = new Api(storageMock as unknown as Storage);

describe("API", () => {
  describe("getPaginatedIssues", () => {
    it("should call storage.getPaginatedIssues and return it's value", async () => {
      storageMock.getPaginatedIssues.mockResolvedValue(testIssueArray);
      const filters: GetPaginatedIssuesFilters = {
        resolved: false,
        searchString: "something",
        page: 1,
        perPage: 10,
      };
      const result = await api.getPaginatedIssues(filters);
      expect(storageMock.getPaginatedIssues).toHaveBeenCalledWith(filters);
      expect(result).toEqual(testIssueArray);
    });
  });

  describe("getIssuesTotal", () => {
    it("should call storage.getIssuesTotal and return it's value (a number)", async () => {
      storageMock.getIssuesTotal.mockResolvedValue(3);
      const filters: GetIssuesFilters = {
        resolved: false,
        searchString: "something",
      };
      const result = await api.getIssuesTotal(filters);
      expect(storageMock.getIssuesTotal).toHaveBeenCalledWith(filters);
      expect(result).toEqual(3);
    });
  });

  describe("deleteIssues", () => {
    it("should call storage.deleteIssues and return it's value", async () => {
      const ids = ["1", "2", "3"];
      await api.deleteIssues(ids);
      expect(storageMock.deleteIssues).toHaveBeenCalledWith(ids);
    });
  });

  describe("resolveIssues", () => {
    it("should call storage.resolveIssues and return it's value", async () => {
      const ids = ["1", "2", "3"];
      await api.resolveIssues(ids);
      expect(storageMock.resolveIssues).toHaveBeenCalledWith(ids);
    });
  });
});
