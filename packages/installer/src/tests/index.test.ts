import main from "..";
import { RepoDataType } from "../types";
import {
  customExample,
  serverFrameworkExample,
  storageExample,
} from "./examples";
import { mockInstall, RegistryMock, TerminalMock } from "./mocks";

const terminal = new TerminalMock();
const registry = new RegistryMock();

async function run() {
  await main(registry, terminal, mockInstall);
}

describe("main", () => {
  it("should query the user for their choice of plugins", async () => {
    await run();
    expect(terminal.select).toHaveBeenCalledTimes(2);

    expect(terminal.select).toHaveBeenCalledWith({
      message: expect.stringContaining("server framework"),
      options: expect.any(Array),
    });

    expect(terminal.select).toHaveBeenCalledWith({
      message: expect.stringContaining("storage"),
      options: expect.any(Array),
    });
  });

  describe("given there's no existing core version", () => {
    /*
     * The latest compatible core version isn't necessarily the latest version.
     * It's the latest version that's compatible with all the dependencies in
     *  the user's plugins list.
     * */
    it("should install the latest compatible core version", async () => {
      const scenarios: (
        | {
            dependencies: {
              serverFramework: RepoDataType;
              storage: RepoDataType;
            };
            expectedCoreVersion: string;
            message?: undefined;
          }
        | {
            dependencies: {
              serverFramework: RepoDataType;
              storage: RepoDataType;
            };
            expectedCoreVersion: null;
            message: string;
          }
      )[] = [
        {
          dependencies: {
            serverFramework: serverFrameworkExample,
            storage: storageExample,
          },
          expectedCoreVersion: "^1.0.0",
        },
        {
          dependencies: {
            serverFramework: customExample({
              base: "express",
              latest: "2.0.0",
              versions: [
                { "2.0.0": "^1.5.6" },
                { "1.5.6": "^1.0.0" },
                { "1.0.0": "^1.0.0" },
              ],
            }),
            storage: customExample({
              base: "postgresql",
              latest: "3.2.1",
              versions: [
                { "3.2.1": "^1.4.0" },
                { "2.0.0": "^1.0.0" },
                { "1.0.0": "^1.0.0" },
              ],
            }),
          },
          expectedCoreVersion: "^1.5.6",
        },
        {
          dependencies: {
            serverFramework: customExample({
              base: "express",
              latest: "3.2.1",
              versions: [
                { "3.2.1": "^1.4.0" },
                { "2.0.0": "^1.0.0" },
                { "1.0.0": "^1.0.0" },
              ],
            }),
            storage: customExample({
              base: "postgresql",
              latest: "2.0.0",
              versions: [
                { "2.0.0": "^1.5.6" },
                { "1.5.6": "^1.0.0" },
                { "1.0.0": "^1.0.0" },
              ],
            }),
          },
          expectedCoreVersion: "^1.5.6",
        },
        {
          dependencies: {
            serverFramework: customExample({
              base: "express",
              latest: "2.0.0",
              versions: [
                { "2.0.0": "^3.5.6" },
                { "1.5.6": "^1.0.0" },
                { "1.0.0": "^1.0.0" },
              ],
            }),
            storage: customExample({
              base: "postgresql",
              latest: "3.2.1",
              versions: [
                { "3.2.1": "^2.4.0" },
                { "2.0.0": "^1.0.0" },
                { "1.0.0": "^1.0.0" },
              ],
            }),
          },
          /*
           * Since there's a difference in the major core version (^3.5.6 and ^2.4.0),
           * it should check the next version of each dependency to find
           * the latest compatible core version.
           * */
          expectedCoreVersion: "^1.0.0",
        },
        {
          dependencies: {
            serverFramework: customExample({
              base: "express",
              latest: "2.0.0",
              versions: [{ "2.0.0": "^1.5.6" }, { "1.0.0": "^1.0.0" }],
            }),
            storage: customExample({
              base: "postgresql",
              latest: "1.0.0",
              versions: [{ "1.0.0": "^2.4.0" }],
            }),
          },
          /*
           * Here, because of the difference in the major core versions,
           * and the storage plugin has no previous versions that use a core version
           * that might be compatible with the other plugins(server framework),
           * it should not install any core version, and should display a message
           * that explains the first incompatibility.
           * */
          expectedCoreVersion: null,
          message: `Some of the plugins you selected are incompatible.\n@codewatch/postgres requires @codewatch/core version ^2.4.0, but @codewatch/express requires @codewatch/core version ^1.5.6`,
        },
      ];

      for (const scenario of scenarios) {
        registry.setNextStorageResponse(scenario.dependencies.storage);
        registry.setNextServerFrameworkResponse(
          scenario.dependencies.serverFramework
        );

        await run();

        if (scenario.expectedCoreVersion) {
          expect(mockInstall).toHaveBeenCalledWith([
            `@codewatch/core@${scenario.expectedCoreVersion}`,
          ]);
          mockInstall.mockClear();
        } else {
          expect(mockInstall).not.toHaveBeenCalled();
          mockInstall.mockClear();
          if (scenario.message) {
            expect(terminal.display).toHaveBeenCalledWith(
              expect.stringContaining(scenario.message)
            );
          }
        }
      }
    });

    // it("should install the latest version of each dependency", async () => {});
  });
});
