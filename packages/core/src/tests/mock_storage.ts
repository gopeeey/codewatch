import { Issue, Occurrence, Storage } from "../types";

export class MockStorage implements Storage {
  private _nextId: number = 1;
  issues: Issue[] = [];
  occurrences: Occurrence[] = [];
  private static _instance: MockStorage | null = null;

  private constructor() {}

  static createInstance() {
    if (!MockStorage._instance) MockStorage._instance = new MockStorage();
  }

  static getInstance() {
    if (!MockStorage._instance) throw new Error("No mock storage instance");
    return MockStorage._instance;
  }

  async init() {}

  createIssue: Storage["createIssue"] = async (data) => {
    this.issues.push({
      ...data,
      id: (this._nextId++).toString(),
      resolved: false,
    });
    return (this._nextId - 1).toString();
  };

  addOccurrence: Storage["addOccurrence"] = async (data) => {
    this.occurrences.push(data);
  };

  private _updateIssueById(id: string, update: Partial<Omit<Issue, "id">>) {
    const index = this.issues.findIndex((issue) => issue.id.toString() === id);
    if (index < 0) throw new Error(`Issue ${id} not found`);
    this.issues[index] = { ...this.issues[index], ...update };
  }

  updateLastOccurrenceOnIssue: Storage["updateLastOccurrenceOnIssue"] = async (
    data
  ) => {
    const issue = this.issues.find((issue) => issue.id === data.issueId);
    if (!issue) throw new Error("Issue not found");
    this._updateIssueById(data.issueId, {
      lastOccurrenceTimestamp: data.timestamp,
      lastOccurrenceMessage: data.message,
      totalOccurrences: issue.totalOccurrences + 1,
    });
  };

  findIssueIdByFingerprint: Storage["findIssueIdByFingerprint"] = async (
    fingerprint
  ) => {
    const issue = this.issues.find(
      (issue) => issue.fingerprint === fingerprint
    );
    if (!issue) return null;
    return issue.id;
  };

  close: Storage["close"] = async () => {
    MockStorage._instance = null;
  };

  getPaginatedIssues: Storage["getPaginatedIssues"] = async () => {
    return this.issues;
  };

  getIssuesTotal: Storage["getIssuesTotal"] = async () => {
    return this.issues.length;
  };

  deleteIssues: Storage["deleteIssues"] = async (issueIds) => {
    this.issues = this.issues.filter((issue) => !issueIds.includes(issue.id));
  };

  resolveIssues: Storage["resolveIssues"] = async (issueIds) => {
    issueIds.forEach((issueId) => {
      this._updateIssueById(issueId, { resolved: true });
    });
  };
}
