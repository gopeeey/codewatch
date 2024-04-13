import { Issue } from "@codewatch/core";

export interface DbIssue extends Omit<Issue, "id"> {
  id: number;
}
