import { GetTestObjectFunc, Hook, Test as TestInterface } from "./types";

export class Test<
  TestObject,
  SeedData = void,
  SeedReturnType = void,
  PostProcessingData = undefined,
  PostProcessingReturnType = void
> implements
    TestInterface<
      SeedData,
      SeedReturnType,
      PostProcessingData,
      PostProcessingReturnType
    >
{
  constructor(protected getTestObject: GetTestObjectFunc<TestObject>) {}

  protected async seedFunc(data: SeedData): Promise<SeedReturnType> {
    throw new Error("Seed function not set");
  }
  protected async postProcessingFunc(
    data: PostProcessingData
  ): Promise<PostProcessingReturnType> {
    throw new Error("Post-processing function not set");
  }

  setSeedFunc(func: Hook<SeedData, SeedReturnType>) {
    if (func) this.seedFunc = func;
  }

  setPostProcessingFunc(
    func: Hook<PostProcessingData, PostProcessingReturnType>
  ) {
    if (func) this.postProcessingFunc = func;
  }
  run() {}
}
