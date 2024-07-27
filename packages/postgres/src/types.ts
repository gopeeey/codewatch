import { Issue } from "@codewatch/types";

export interface DbIssue extends Omit<Issue, "id"> {
  id: number;
}
