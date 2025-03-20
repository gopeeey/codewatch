import { Scenario } from "src/scenario";
import { Storage } from "src/types";

export class StorageScenario extends Scenario {
  constructor(protected _storage: Storage) {
    super();
  }
}
