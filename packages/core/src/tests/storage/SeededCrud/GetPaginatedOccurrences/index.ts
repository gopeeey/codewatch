import { StorageScenario } from "src/tests/storage/StorageScenario";
import {
  GetStorageFunc,
  InsertIssueFunc,
  InsertOccurrenceFunc,
  IsoFromNow,
} from "src/tests/storage/types";
import { createCreateIssueData } from "src/tests/storage/utils";
import { ApplySuppliedFilters } from "./ApplySuppliedFilters";
import { PaginateOccurrences } from "./PaginateOccurrences";
import { SortOccurrencesByTimestamp } from "./SortOccurrencesByTimestamp";

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

  private insertOccurrence: InsertOccurrenceFunc;
  private insertIssue: InsertIssueFunc;
  private isoFromNow: IsoFromNow;
  private occurrenceCount = 10;

  constructor(
    getStorage: GetStorageFunc,
    insertOccurrence: InsertOccurrenceFunc,
    insertIssue: InsertIssueFunc,
    isoFromNow: IsoFromNow
  ) {
    super(getStorage);

    this.sort_occurrences_by_timestamp = new SortOccurrencesByTimestamp(
      getStorage,
      this.occurrenceCount,
      isoFromNow
    );

    this.paginate_occurrences = new PaginateOccurrences(
      getStorage,
      this.occurrenceCount,
      isoFromNow
    );

    this.apply_supplied_filters = new ApplySuppliedFilters(
      getStorage,
      this.occurrenceCount,
      isoFromNow
    );

    this.insertOccurrence = insertOccurrence;
    this.insertIssue = insertIssue;
    this.isoFromNow = isoFromNow;
  }

  private async seedOccurrences() {
    const now = new Date().toISOString();
    const issueData = createCreateIssueData(now);
    const issueId = await this.insertIssue(issueData);

    for (let i = 1; i <= this.occurrenceCount; i++) {
      await this.insertOccurrence({
        issueId,
        message: `Error ${i}`,
        timestamp: this.isoFromNow(i * 1000),
        stdoutLogs: [],
        stderrLogs: [],
        stack: i.toString(),
      });
    }

    this.sort_occurrences_by_timestamp.issueId = issueId;
    this.paginate_occurrences.issueId = issueId;
    this.apply_supplied_filters.issueId = issueId;
  }

  run() {
    this.setBeforeEach(this.seedOccurrences.bind(this), 5000);

    describe("getPaginatedOccurrences", () => {
      this.callHooks();
      this.sort_occurrences_by_timestamp.run();
      this.paginate_occurrences.run();
      this.apply_supplied_filters.run();
    });
  }
}
