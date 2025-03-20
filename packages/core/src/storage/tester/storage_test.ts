import { Test } from "src/test";
import { Storage } from "src/types";

export class StorageTest<
  SeedData = void,
  SeedReturnType = void,
  PostProcessingData = undefined,
  PostProcessingReturnType = void
> extends Test<
  SeedData,
  SeedReturnType,
  PostProcessingData,
  PostProcessingReturnType
> {
  constructor(private _storage: Storage) {
    super();
  }

  protected async getStorage(init = true) {
    if (init && !this._storage.ready) await this._storage.init();
    return this._storage;
  }
}
