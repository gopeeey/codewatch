import { StorageTest } from "src/tests/storage/StorageTest";
import { GetStorageFunc, IsoFromNow } from "src/tests/storage/types";
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
