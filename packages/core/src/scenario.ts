import { Scenario as ScenarioInterface } from "src/types/test";

export class Scenario implements ScenarioInterface {
  private _beforeEach?: () => void;
  private _afterEach?: () => void;
  private _beforeAll?: () => void;
  private _afterAll?: () => void;
  private _beforeEachTimeout?: number;
  private _afterEachTimeout?: number;
  private _beforeAllTimeout?: number;
  private _afterAllTimeout?: number;
  private _muted = false;

  protected callHooks() {
    if (this._beforeAll) beforeAll(this._beforeAll, this._beforeAllTimeout);
    if (this._afterAll) afterAll(this._afterAll, this._afterAllTimeout);
    if (this._beforeEach) beforeEach(this._beforeEach, this._beforeEachTimeout);
    if (this._afterEach) afterEach(this._afterEach, this._afterEachTimeout);
  }

  setBeforeEach(func: Scenario["_beforeEach"], timeout?: number) {
    this._beforeEach = func;
    this._beforeEachTimeout = timeout;
  }

  setAfterEach(func: Scenario["_afterEach"], timeout?: number) {
    this._afterEach = func;
    this._afterEachTimeout = timeout;
  }

  setBeforeAll(func: Scenario["_beforeAll"], timeout?: number) {
    this._beforeAll = func;
    this._beforeAllTimeout = timeout;
  }

  setAfterAll(func: Scenario["_afterAll"], timeout?: number) {
    this._afterAll = func;
    this._afterAllTimeout = timeout;
  }

  mute() {
    this._muted = true;
  }

  protected runScenario() {}

  run() {
    if (this._muted) return;
    this.callHooks();
    this.runScenario();
  }
}
