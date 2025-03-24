import { StorageScenario } from "src/storage/tester/storage_scenario";
import {
  CreateOccurrenceData,
  InsertIssuesFn,
  InsertOccurrencesFn,
  IsoFromNow,
} from "src/storage/tester/types";
import { createCreateIssueData } from "src/storage/tester/utils";
import { Storage } from "src/types";
import { ApplySuppliedFilters } from "./apply_supplied_filters";
import { PaginateOccurrences } from "./paginate_occurrences";
import { SortOccurrencesByTimestamp } from "./sort_occurrences_by_timestamp";

export class GetPaginatedOccurrences extends StorageScenario {
  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  sort_occurrences_by_timestamp: SortOccurrencesByTimestamp;

  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  paginate_occurrences: PaginateOccurrences;

  /**
   * Seeder: None
   *
   * Post-processor: None
   */
  apply_supplied_filters: ApplySuppliedFilters;

  private insertOccurrence: InsertOccurrencesFn;
  private insertIssues: InsertIssuesFn;
  private isoFromNow: IsoFromNow;
  private occurrenceCount = 10;

  constructor(
    storage: Storage,
    insertOccurrence: InsertOccurrencesFn,
    insertIssues: InsertIssuesFn,
    isoFromNow: IsoFromNow
  ) {
    super(storage);

    this.sort_occurrences_by_timestamp = new SortOccurrencesByTimestamp(
      storage,
      this.occurrenceCount,
      isoFromNow
    );

    this.paginate_occurrences = new PaginateOccurrences(
      storage,
      this.occurrenceCount,
      isoFromNow
    );

    this.apply_supplied_filters = new ApplySuppliedFilters(
      storage,
      this.occurrenceCount,
      isoFromNow
    );

    this.insertOccurrence = insertOccurrence;
    this.insertIssues = insertIssues;
    this.isoFromNow = isoFromNow;
  }

  private async seedOccurrences() {
    const now = new Date().toISOString();
    const issueData = createCreateIssueData(now);
    const [issue] = await this.insertIssues([issueData]);

    const occurrencesData: CreateOccurrenceData[] = [];
    for (let i = 1; i <= this.occurrenceCount; i++) {
      occurrencesData.push({
        issueId: issue.id,
        message: `Error ${i}`,
        timestamp: this.isoFromNow(i * 1000),
        stdoutLogs: [],
        stderrLogs: [],
        stack: i.toString(),
      });
    }
    await this.insertOccurrence(occurrencesData);

    this.sort_occurrences_by_timestamp.issueId = issue.id;
    this.paginate_occurrences.issueId = issue.id;
    this.apply_supplied_filters.issueId = issue.id;
  }

  protected runScenario() {
    this.setBeforeEach(this.seedOccurrences.bind(this), 5000);

    describe("getPaginatedOccurrences", () => {
      this.callHooks();
      this.sort_occurrences_by_timestamp.run();
      this.paginate_occurrences.run();
      this.apply_supplied_filters.run();
    });
  }
}
