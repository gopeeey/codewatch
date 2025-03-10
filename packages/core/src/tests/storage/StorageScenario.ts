import { Scenario } from "src/tests/Scenario";
import { GetStorageFunc } from "src/tests/storage/types";
import { Storage } from "src/types";

export class StorageScenario extends Scenario<Storage> {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }
}
