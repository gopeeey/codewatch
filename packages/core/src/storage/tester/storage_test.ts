import { GetStorageFunc } from "src/storage/tester/types";
import { Test } from "src/test";
import { Storage } from "src/types";

export class StorageTest<
  SeedData = void,
  SeedReturnType = void,
  PostProcessingData = undefined,
  PostProcessingReturnType = void
> extends Test<
  Storage,
  SeedData,
  SeedReturnType,
  PostProcessingData,
  PostProcessingReturnType
> {
  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
  }

  protected async getStorage(init = true) {
    const storage = this.getTestObject();
    if (init) await storage.init();
    return storage;
  }
}
