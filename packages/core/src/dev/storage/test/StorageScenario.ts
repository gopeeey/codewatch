import { Scenario } from "dev/Scenario";
import { GetStorageFunc } from "dev/types";
import { Storage } from "src/types";

export class StorageScenario extends Scenario<Storage> {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }
}
