import { Issue, Occurrence } from "codewatch-core/dist/types";

export interface DbIssue extends Omit<Issue, "id"> {
  id: number;
}

export interface DbOccurrence extends Omit<Occurrence, "id" | "issueId"> {
  id: number;
  issueId: number;
}
