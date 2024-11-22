import {
  InstallerInterface,
  PluginName,
  RegistryInterface,
  RepoDataType,
  SelectOptions,
  TerminalInterface,
} from "../types";
import {
  coreExample,
  serverFrameworkExample,
  storageExample,
} from "./examples";

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

export const defaultTerminalSelectImpl = async <T extends string>({
  options,
}: SelectOptions<T>) => {
  return options[0].value;
};

export class TerminalMock implements TerminalInterface {
  select = jest.fn().mockImplementation(defaultTerminalSelectImpl);

  display = jest.fn();
}

export class RegistryMock implements RegistryInterface {
  private _nextCoreResponse: RepoDataType | null = null;
  private _nextStorageResponse: RepoDataType | null = null;
  private _nextServerFrameworkResponse: RepoDataType | null = null;

  async getCore() {
    if (this._nextCoreResponse) {
      const res = this._nextCoreResponse;
      this._nextCoreResponse = null;
      return res;
    }
    return coreExample;
  }

  async getPlugin(name: PluginName) {
    switch (name) {
      case "postgresql":
        if (this._nextStorageResponse) {
          const res = this._nextStorageResponse;
          this._nextStorageResponse = null;
          return res;
        }
        return storageExample;
        break;
      case "express":
        if (this._nextServerFrameworkResponse) {
          const res = this._nextServerFrameworkResponse;
          this._nextServerFrameworkResponse = null;
          return res;
        }
        return serverFrameworkExample;
        break;
      // case "mongodb":
      //     break;
      default:
        throw new Error("Unsupported plugin " + name);
    }
  }

  setNextCoreResponse(res: RepoDataType) {
    this._nextCoreResponse = res;
  }

  setNextStorageResponse(res: RepoDataType) {
    this._nextStorageResponse = res;
  }

  setNextServerFrameworkResponse(res: RepoDataType) {
    this._nextServerFrameworkResponse = res;
  }
}

export const mockInstall = jest
  .fn()
  .mockImplementation(async (dependencies: string[]) => {});

export class MockInstaller implements InstallerInterface {
  install = jest.fn().mockImplementation(async (dependencies: string[]) => {});

  checkInstalledCoreVersion = jest.fn().mockResolvedValue(undefined);
}
