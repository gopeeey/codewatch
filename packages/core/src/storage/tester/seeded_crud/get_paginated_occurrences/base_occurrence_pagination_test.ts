import { StorageTest } from "src/storage/tester/storage_test";
import { IsoFromNow } from "src/storage/tester/types";
import { Issue, Storage } from "src/types";

export class BaseOccurrencePaginationTest extends StorageTest {
  occurrenceCount: number;
  isoFromNow: IsoFromNow;
  issueId: Issue["id"] = "isSetByTheScenario";

  constructor(
    storage: Storage,
    occurrenceCount: number,
    isoFromNow: IsoFromNow
  ) {
    super(storage);
    this.occurrenceCount = occurrenceCount;
    this.isoFromNow = isoFromNow;
  }

  protected runTest(): void {}
}
