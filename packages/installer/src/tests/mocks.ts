import {
  RegistryInterface,
  RepoDataType,
  SelectOptions,
  TerminalInterface,
} from "../types";
import { coreExample, storageExample } from "./examples";

class Mock {
  calls: {
    [key: string]: {
      calls: number;
      arguments: any[][];
    };
  } = {};

  reset() {
    this.calls = {};
  }
}

export class TerminalMock implements TerminalInterface {
  select = jest
    .fn()
    .mockImplementation(
      async <T extends string>({ options }: SelectOptions<T>) => {
        return options[0].value;
      }
    );
}

export class RegistryMock implements RegistryInterface {
  private _nextResponse: RepoDataType | null = null;
  async get(name: string) {
    if (this._nextResponse) {
      const res = this._nextResponse;
      this._nextResponse = null;
      return res;
    }

    switch (name) {
      case "@codewatch/core":
        return coreExample;
        break;
      case "@codewatch/postgres":
        return storageExample;
        break;
      // case "@codewatch/express":
      //     break;
      // case "@codewatch/mongodb":
      //     break;
      default:
        throw new Error("Unsupported repo " + name);
    }
  }

  setNextResponse(res: RepoDataType) {
    this._nextResponse = res;
  }
}
