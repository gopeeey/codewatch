import { Scenario } from "src/scenario";
import { GetStorageFunc } from "src/storage/tester/types";
import { Storage } from "src/types";

export class StorageScenario extends Scenario<Storage> {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }
}
