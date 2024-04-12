import { Api } from "../api";
import { GetPaginatedIssuesFilters, Storage } from "../types";
import { testIssueArray } from "./samples";

const storageMock: {
  [key in keyof Pick<Storage, "getPaginatedIssues">]: jest.Mock;
} = {
  getPaginatedIssues: jest.fn(),
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
});
