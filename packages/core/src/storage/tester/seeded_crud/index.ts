import { StorageScenario } from "src/storage/tester/storage_scenario";
import { Storage } from "src/types";
import {
  CreateIssueData,
  CreateOccurrenceData,
  InsertTestIssueFn,
  InsertTestOccurrenceFn,
  TestIssueData,
} from "../types";
import { createCreateIssueData } from "../utils";
import { ArchiveIssues } from "./archive_issues";
import { DeleteIssues } from "./delete_issues";
import { FindIssueById } from "./find_issue_by_id";
import { GetIssuesTotal } from "./get_issues_total";
import { GetPaginatedIssues } from "./get_paginated_issues";
import { GetPaginatedOccurrences } from "./get_paginated_occurrences";
import { GetStatsData } from "./get_stats_data";
import { ResolveIssues } from "./resolve_issues";
import { UnarchiveIssues } from "./unarchive_issues";
import { UnresolveIssues } from "./unresolve_issues";

export class SeededCrud extends StorageScenario {
  crudNow = Date.now();
  private insertTestIssue?: InsertTestIssueFn;
  private insertTestOccurrence?: InsertTestOccurrenceFn;

  get_paginated_issues: GetPaginatedIssues;
  get_issues_total: GetIssuesTotal;
  delete_issues: DeleteIssues;
  resolve_issues: ResolveIssues;
  unresolve_issues: UnresolveIssues;
  archive_issues: ArchiveIssues;
  unarchive_issues: UnarchiveIssues;
  find_issue_by_id: FindIssueById;
  get_paginated_occurrences: GetPaginatedOccurrences;
  get_stats_data: GetStatsData;

  constructor(storage: Storage) {
    super(storage);

    this.get_paginated_issues = new GetPaginatedIssues(
      storage,
      this.issuesData,
      this.isoFromNow.bind(this)
    );

    this.get_issues_total = new GetIssuesTotal(
      storage,
      this.issuesData,
      this.isoFromNow.bind(this)
    );

    this.delete_issues = new DeleteIssues(storage);
    this.resolve_issues = new ResolveIssues(storage);
    this.unresolve_issues = new UnresolveIssues(storage);
    this.archive_issues = new ArchiveIssues(storage);
    this.unarchive_issues = new UnarchiveIssues(storage);
    this.find_issue_by_id = new FindIssueById(storage);
    this.get_paginated_occurrences = new GetPaginatedOccurrences(
      storage,
      this.insertOccurrence.bind(this),
      this.insertIssue.bind(this),
      this.isoFromNow.bind(this)
    );
    this.get_stats_data = new GetStatsData(
      storage,
      this.issuesData,
      this.isoFromNow.bind(this)
    );
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

  private async insertOccurrence(data: CreateOccurrenceData) {
    if (!this.insertTestOccurrence) {
      throw new Error("No insertTestOccurrence function set");
    }
    return this.insertTestOccurrence(data);
  }

  private async seed() {
    if (!this._storage.ready) await this._storage.init(); // Just to initialize the storage (create tables or whatever if they don't exist)

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
              i + 1 === issueData.totalOccurrences
                ? issueData.lastOccurrenceTimestamp
                : issueData.createdAt
            ).toISOString(),
            stack: `Occurrence stack for ${issueData.name}`,
          });
        }
      })
    );
  }

  protected runScenario() {
    describe("Seeded CRUD", () => {
      beforeEach(this.seed.bind(this), 10000);

      this.callHooks();
      this.get_paginated_issues.run();
      this.get_issues_total.run();
      this.delete_issues.run();
      this.resolve_issues.run();
      this.unresolve_issues.run();
      this.archive_issues.run();
      this.unarchive_issues.run();
      this.find_issue_by_id.run();
      this.get_paginated_occurrences.run();
      this.get_stats_data.run();
    });
  }
}
