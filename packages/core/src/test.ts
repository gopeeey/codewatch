import { Hook, Test as TestInterface } from "src/types/test";

export class Test<
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
  private _muted = false;
  protected _timeout?: number = undefined;

  protected async seedFunc(data: SeedData): Promise<SeedReturnType> {
    throw new Error("Seed function not set");
  }
  protected async postProcessingFunc(
    data: PostProcessingData
  ): Promise<PostProcessingReturnType> {
    throw new Error("Post-processing function not set");
  }

  mute() {
    this._muted = true;
  }

  setSeedFunc(func: Hook<SeedData, SeedReturnType>) {
    if (func) this.seedFunc = func;
  }

  setPostProcessingFunc(
    func: Hook<PostProcessingData, PostProcessingReturnType>
  ) {
    if (func) this.postProcessingFunc = func;
  }

  setTimeout(timeout: number) {
    this._timeout = timeout;
  }

  protected runTest() {} // To be implemented in subclasses

  run() {
    if (this._muted) return;
    this.runTest();
  }

  protected runJestTest(name: string, test: () => Promise<void>) {
    it(name, test, this._timeout);
  }
}
