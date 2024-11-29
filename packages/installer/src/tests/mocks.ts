import { jest } from "@jest/globals";
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
  installerExample,
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
  select = jest.fn<any>().mockImplementation(defaultTerminalSelectImpl);

  display = jest.fn();

  displaySpinner = jest
    .fn<TerminalInterface["displaySpinner"]>()
    .mockImplementation(async (text, action) => {
      return await action();
    });

  execute = jest.fn<TerminalInterface["execute"]>().mockResolvedValue("");
}

export class RegistryMock implements RegistryInterface {
  private _nextCoreResponse: RepoDataType | null = null;
  private _nextStorageResponse: RepoDataType | null = null;
  private _nextServerFrameworkResponse: RepoDataType | null = null;
  private _nextInstallerResponse: RepoDataType | null = null;

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

  async getInstaller() {
    if (this._nextInstallerResponse) {
      const res = this._nextInstallerResponse;
      this._nextInstallerResponse = null;
      return res;
    }
    return installerExample;
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

  setNextInstallerResponse(res: RepoDataType) {
    this._nextInstallerResponse = res;
  }
}

export class MockInstaller implements InstallerInterface {
  _execute: TerminalInterface["execute"];

  constructor(execute: TerminalInterface["execute"]) {
    this._execute = execute;
  }
  install = jest
    .fn<InstallerInterface["install"]>()
    .mockImplementation(async (dependencies: string[]) => {});

  checkInstalledCoreVersion = jest
    .fn<InstallerInterface["checkInstalledCoreVersion"]>()
    .mockResolvedValue(undefined);

  checkInstallerVersion = jest
    .fn<InstallerInterface["checkInstallerVersion"]>()
    .mockResolvedValue("1.0.0");
}
