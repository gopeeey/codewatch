import { Issue } from "src/types";

export interface CreateIssueData extends Omit<Issue, "id" | "resolved"> {
  resolved?: Issue["resolved"];
}
