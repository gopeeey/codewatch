import { getPaginatedIssues } from "../controllers";
import { GetPaginatedIssuesFilters, Storage } from "../types";
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
      { body: filters, query: null, params: null },
      storage
    );
    expect(storageMock.getPaginatedIssues).toHaveBeenCalledWith(filters);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(testIssueArray);
  });
});
