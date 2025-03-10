import { StorageScenario } from "src/tests/storage/StorageScenario";
import { GetStorageFunc } from "src/tests/types";
import {
  CraeteOccurrenceData,
  CreateIssueData,
  InsertTestIssueFn,
  InsertTestOccurrenceFn,
  TestIssueData,
} from "../types";
import { createCreateIssueData } from "../utils";
import { ArchiveIssues } from "./ArchiveIssues";
import { DeleteIssues } from "./DeleteIssues";
import { GetIssuesTotal } from "./GetIssuesTotal";
import { GetPaginatedIssues } from "./GetPaginatedIssues";
import { ResolveIssues } from "./ResolveIssues";
import { UnresolveIssues } from "./UnresolveIssues";

export class SeededCrud extends StorageScenario {
  crudNow = Date.now();
  private insertTestIssue?: InsertTestIssueFn;
  private insertTestOccurrence?: InsertTestOccurrenceFn;
  private getStorage: GetStorageFunc;

  get_paginated_issues: GetPaginatedIssues;
  get_issues_total: GetIssuesTotal;
  delete_issues: DeleteIssues;
  resolve_issues: ResolveIssues;
  unresolve_issues: UnresolveIssues;
  archive_issues: ArchiveIssues;

  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
    this.getStorage = getStorage;

    this.get_paginated_issues = new GetPaginatedIssues(
      getStorage,
      this.issuesData,
      this.isoFromNow.bind(this)
    );

    this.get_issues_total = new GetIssuesTotal(
      getStorage,
      this.issuesData,
      this.isoFromNow.bind(this)
    );

    this.delete_issues = new DeleteIssues(getStorage);
    this.resolve_issues = new ResolveIssues(getStorage);
    this.unresolve_issues = new UnresolveIssues(getStorage);
    this.archive_issues = new ArchiveIssues(getStorage);
  }

  private isoFromNow = (offset: number) => {
    return new Date(this.crudNow - offset).toISOString();
  };

  private issuesData: TestIssueData[] = [
    {
      timestamp: this.isoFromNow(24 * 60 * 60 * 1000),
      overrides: {
        name: "Past one",
        fingerprint: "098",
      },
    },
    {
      timestamp: this.isoFromNow(35000),
      overrides: {
        name: "Error 123",
        fingerprint: "890",
        archived: true,
        unhandled: true,
      },
    },
    {
      timestamp: this.isoFromNow(30000),
      overrides: {
        name: "Error 2",
        fingerprint: "789",
        resolved: true,
        totalOccurrences: 30,
      },
    },
    {
      timestamp: this.isoFromNow(25000),
      overrides: {
        name: "Nothing like the rest",
        fingerprint: "123",
        isLog: true,
      },
    },
    {
      timestamp: this.isoFromNow(20000),
      overrides: {
        name: "Special error",
        fingerprint: "234",
        lastOccurrenceTimestamp: this.isoFromNow(6001),
        unhandled: true,
        totalOccurrences: 2,
      },
    },
    { timestamp: this.isoFromNow(15000), overrides: { fingerprint: "345" } },
    {
      timestamp: this.isoFromNow(10000),
      overrides: {
        name: "Error 2",
        fingerprint: "456",
        lastOccurrenceTimestamp: this.isoFromNow(2000),
        totalOccurrences: 2,
        unhandled: true,
      },
    },
    {
      timestamp: this.isoFromNow(5000),
      overrides: { name: "Error 3", fingerprint: "567", totalOccurrences: 14 },
    },
    {
      timestamp: this.isoFromNow(0),
      overrides: { fingerprint: "678", unhandled: true, totalOccurrences: 21 },
    },
  ];

  setInsertTestIssueFn(fn: InsertTestIssueFn) {
    this.insertTestIssue = fn;
  }

  setInsertTestOccurrenceFn(fn: InsertTestOccurrenceFn) {
    this.insertTestOccurrence = fn;
  }

  private async insertIssue(data: CreateIssueData) {
    if (!this.insertTestIssue) {
      throw new Error("No insertTestIssue function set");
    }
    return this.insertTestIssue(data);
  }

  private async insertOccurrence(data: CraeteOccurrenceData) {
    if (!this.insertTestOccurrence) {
      throw new Error("No insertTestOccurrence function set");
    }
    return this.insertTestOccurrence(data);
  }

  private async seed() {
    const storage = this.getStorage();
    await storage.init(); // Just to initialize the storage (create tables or whatever if they don't exist)
    try {
      await Promise.all(
        this.issuesData.map(async ({ timestamp, overrides }, index) => {
          const issueData = createCreateIssueData(timestamp, overrides);
          const issueId = await this.insertIssue(issueData);

          for (let i = 0; i < issueData.totalOccurrences; i++) {
            await this.insertOccurrence({
              issueId,
              message: `Occurrence for ${issueData.name}`,
              stderrLogs: [],
              stdoutLogs: [],
              timestamp: new Date(
                index + 1 === issueData.totalOccurrences
                  ? issueData.lastOccurrenceTimestamp
                  : issueData.createdAt
              ).toISOString(),
              stack: `Occurrence stack for ${issueData.name}`,
            });
          }
        })
      );
    } catch (err) {
      await storage.close();
      throw err;
    }

    await storage.close();
  }

  run() {
    this.setBeforeEach(this.seed.bind(this), 5000);

    describe("Seeded CRUD", () => {
      this.callHooks();
      this.get_paginated_issues.run();
      this.get_issues_total.run();
      this.delete_issues.run();
      this.resolve_issues.run();
      this.unresolve_issues.run();
      this.archive_issues.run();
    });
  }
}
