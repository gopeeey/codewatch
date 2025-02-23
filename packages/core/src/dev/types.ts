import { Storage } from "@types";

export type Hook<Data = never, ReturnType = void> = (
  data: Data
) => Promise<ReturnType>;

export interface Test<
  SeedData = undefined,
  SeedReturnType = void,
  PostProcessingData = undefined,
  PostProcessingReturnType = void
> {
  setSeedFunc: (func: Hook<SeedData, SeedReturnType>) => void;
  setPostProcessingFunc: (
    func: Hook<PostProcessingData, PostProcessingReturnType>
  ) => void;
}

export interface Scenario {
  setBeforeEach: (func: () => any, timeout?: number) => void;
  setAfterEach: (func: () => any, timeout?: number) => void;
  setBeforeAll: (func: () => any, timeout?: number) => void;
  setAfterAll: (func: () => any, timeout?: number) => void;
}

export type GetTestObjectFunc<TestObject> = () => TestObject;
export type GetStorageFunc = GetTestObjectFunc<Storage>;

export interface StorageTester {
  run: () => Promise<void>;
}
