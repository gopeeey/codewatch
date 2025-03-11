import { StorageTest } from "src/storage/tester/storage_test";
import { GetStorageFunc, IsoFromNow } from "src/storage/tester/types";
import { Issue } from "src/types";

export class BaseOccurrencePaginationTest extends StorageTest {
  occurrenceCount: number;
  isoFromNow: IsoFromNow;
  issueId: Issue["id"] = "isSetByTheScenario";

  constructor(
    getStorage: GetStorageFunc,
    occurrenceCount: number,
    isoFromNow: IsoFromNow
  ) {
    super(getStorage);
    this.occurrenceCount = occurrenceCount;
    this.isoFromNow = isoFromNow;
  }

  run(): void {}
}
