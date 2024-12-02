import path from "path";
import Main from "..";
import { RepoDataType } from "../types";
import {
  coreExample,
  customExample,
  serverFrameworkExample,
  storageExample,
  uiExample,
} from "./examples";
import {
  MockInstaller,
  RegistryMock,
  TerminalMock,
  defaultTerminalSelectImpl,
} from "./mocks";

const terminal = new TerminalMock();
const registry = new RegistryMock();
const mockInstaller = new MockInstaller(terminal.execute);

const originalArgv = [...process.argv];

async function run(
  command: "install" | "update" = "install",
  version?: string
) {
  process.argv.push(command);
  if (version) process.argv.push(version);

  const main = new Main(registry, terminal, mockInstaller);
  await main.run();
  process.argv = [...originalArgv];
}

const scenarios: (
  | {
      dependencies: {
        serverFramework: RepoDataType;
        storage: RepoDataType;
        ui: RepoDataType;
      };
      expectedCoreVersion: string;
      expectedStorageVersion: string;
      expectedServerFrameworkVersion: string;
      expectedUiVersion: string;
      message?: undefined;
    }
  | {
      dependencies: {
        serverFramework: RepoDataType;
        storage: RepoDataType;
        ui: RepoDataType;
      };
      expectedCoreVersion: null;
      expectedStorageVersion: null;
      expectedServerFrameworkVersion: null;
      expectedUiVersion: null;
      message: string;
    }
)[] = [
  {
    dependencies: {
      serverFramework: serverFrameworkExample,
      storage: storageExample,
      ui: uiExample,
    },
    expectedCoreVersion: "^1.0.0",
    expectedServerFrameworkVersion: "1.0.1",
    expectedStorageVersion: "1.0.1",
    expectedUiVersion: "1.0.1",
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
      ui: customExample({
        base: "ui",
        latest: "3.2.1",
        versions: [
          { "3.2.1": "^1.4.0" },
          { "2.0.0": "^1.0.0" },
          { "1.0.0": "^1.0.0" },
        ],
      }),
    },
    expectedCoreVersion: "^1.5.6",
    expectedServerFrameworkVersion: "2.0.0",
    expectedStorageVersion: "3.2.1",
    expectedUiVersion: "3.2.1",
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
      ui: customExample({
        base: "ui",
        latest: "3.2.1",
        versions: [
          { "3.2.1": "^1.4.0" },
          { "2.0.0": "^1.0.0" },
          { "1.0.0": "^1.0.0" },
        ],
      }),
    },
    expectedCoreVersion: "^1.5.6",
    expectedServerFrameworkVersion: "3.2.1",
    expectedUiVersion: "3.2.1",
    expectedStorageVersion: "2.0.0",
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
      ui: customExample({
        base: "ui",
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
    expectedServerFrameworkVersion: "1.5.6",
    expectedStorageVersion: "2.0.0",
    expectedUiVersion: "2.0.0",
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
      ui: customExample({
        base: "ui",
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
    expectedServerFrameworkVersion: null,
    expectedStorageVersion: null,
    expectedUiVersion: null,
    message: `Some of the plugins you selected are incompatible.\ncodewatch-postgres requires codewatch-core version ^2.4.0, but codewatch-express requires codewatch-core version ^1.5.6`,
  },
];

describe("main", () => {
  it("should query the user for their choice of plugins", async () => {
    await run();
    expect(terminal.select.mock.calls.length).toBeGreaterThanOrEqual(2);

    expect(terminal.select).toHaveBeenCalledWith({
      message: expect.stringContaining("server framework"),
      options: expect.any(Array),
    });

    expect(terminal.select).toHaveBeenCalledWith({
      message: expect.stringContaining("storage"),
      options: expect.any(Array),
    });
  });

  describe("given the install command is passed", () => {
    describe("given no version is specified", () => {
      describe("given there's no existing core version", () => {
        beforeEach(() => {
          mockInstaller.checkInstalledCoreVersion.mockResolvedValueOnce(
            undefined
          );
        });

        /*
         * The latest compatible core version isn't necessarily the latest version.
         * It's the latest version that's compatible with all the dependencies in
         *  the user's plugins list.
         * */
        it("should install the latest compatible core version", async () => {
          for (const scenario of scenarios) {
            registry.setNextStorageResponse(scenario.dependencies.storage);
            registry.setNextServerFrameworkResponse(
              scenario.dependencies.serverFramework
            );

            await run();

            if (scenario.expectedCoreVersion) {
              expect(mockInstaller.install).toHaveBeenCalledWith([
                `codewatch-core@${scenario.expectedCoreVersion}`,
              ]);
              mockInstaller.install.mockClear();
            } else {
              expect(mockInstaller.install).not.toHaveBeenCalled();
              mockInstaller.install.mockClear();
              if (scenario.message) {
                expect(terminal.display).toHaveBeenCalledWith(
                  expect.stringContaining(scenario.message)
                );
              }
            }
          }
        });

        it("should install the correct versions for the plugins selected", async () => {
          for (const scenario of scenarios) {
            registry.setNextStorageResponse(scenario.dependencies.storage);
            registry.setNextServerFrameworkResponse(
              scenario.dependencies.serverFramework
            );

            await run();

            if (scenario.expectedStorageVersion) {
              const calls = mockInstaller.install.mock.calls;
              expect(calls.length).toBe(2); // First call to install the core, second call to install plugins.
              expect(calls[1][0].length).toBe(
                Object.keys(scenario.dependencies).length
              );
              expect(calls[1][0]).toContain(
                `${scenario.dependencies.storage.name}@${scenario.expectedStorageVersion}`
              );
              expect(calls[1][0]).toContain(
                `${scenario.dependencies.serverFramework.name}@${scenario.expectedServerFrameworkVersion}`
              );
              mockInstaller.install.mockClear();
            } else {
              expect(mockInstaller.install).not.toHaveBeenCalled();
              mockInstaller.install.mockClear();
              if (scenario.message) {
                expect(terminal.display).toHaveBeenCalledWith(
                  expect.stringContaining(scenario.message)
                );
              }
            }
          }
        });
      });

      describe("given a version of the core is already installed", () => {
        function setupWithBaseScenario() {
          const scenario = scenarios[0];
          const foundVersion = "2.4.0";

          function setupMocks() {
            registry.setNextStorageResponse(scenario.dependencies.storage);
            registry.setNextServerFrameworkResponse(
              scenario.dependencies.serverFramework
            );

            mockInstaller.checkInstalledCoreVersion.mockResolvedValueOnce(
              foundVersion
            );
          }

          return { scenario, foundVersion, setupMocks };
        }

        it("should notify the user and ask if to overwrite the installation, or use the installed version", async () => {
          const { foundVersion, setupMocks } = setupWithBaseScenario();
          setupMocks();

          await run();

          expect(terminal.select.mock.calls.length).toBeGreaterThanOrEqual(3);

          expect(terminal.select).toHaveBeenCalledWith({
            message: `codewatch-core version ${foundVersion} is already installed. Would you like to overwrite it and determine the most compatible version for you, or continue with the installed version?`,
            options: [
              {
                name: "Determine the most compatible version for me (recommended)",
                value: "overwrite",
              },
              { name: "Use installed version", value: "existing" },
            ],
          });
        });

        describe("given the user asks to overwrite", () => {
          const { scenario, setupMocks } = setupWithBaseScenario();

          beforeEach(() => {
            setupMocks();
            terminal.select
              .mockImplementationOnce(defaultTerminalSelectImpl)
              .mockImplementationOnce(defaultTerminalSelectImpl)
              .mockResolvedValueOnce("overwrite");
          });

          it("should determine and install the most compatible core version", async () => {
            await run();

            expect(mockInstaller.install).toHaveBeenCalledWith([
              `codewatch-core@${scenario.expectedCoreVersion}`,
            ]);
          });

          it("should install the correct plugin versions", async () => {
            await run();

            const calls = mockInstaller.install.mock.calls;
            expect(calls.length).toBe(2); // First call to install the core, second call to install plugins.
            expect(calls[1][0].length).toBe(
              Object.keys(scenario.dependencies).length
            );
            expect(calls[1][0]).toContain(
              `${scenario.dependencies.storage.name}@${scenario.expectedStorageVersion}`
            );
            expect(calls[1][0]).toContain(
              `${scenario.dependencies.serverFramework.name}@${scenario.expectedServerFrameworkVersion}`
            );
          });
        });

        describe("given the user asks to use installed version", () => {
          it("should not install a new version of the core", async () => {
            const { scenario, setupMocks } = setupWithBaseScenario();
            setupMocks();
            terminal.select
              .mockImplementationOnce(defaultTerminalSelectImpl)
              .mockImplementationOnce(defaultTerminalSelectImpl)
              .mockResolvedValueOnce("existing");

            await run();

            expect(mockInstaller.install).not.toHaveBeenCalledWith([
              `codewatch-core@${scenario.expectedCoreVersion}`,
            ]);
          });

          describe("given the installed version is compatible with the selected plugins", () => {
            const scenarios2: {
              dependencies: {
                serverFramework: RepoDataType;
                storage: RepoDataType;
                ui: RepoDataType;
              };
              installedCoreVersion: string;
              expectedServerFrameworkVersion: string;
              expectedStorageVersion: string;
              expectedUiVersion: string;
            }[] = [
              {
                dependencies: {
                  serverFramework: serverFrameworkExample,
                  storage: storageExample,
                  ui: uiExample,
                },
                installedCoreVersion: "1.0.0",
                expectedServerFrameworkVersion: "1.0.1",
                expectedStorageVersion: "1.0.1",
                expectedUiVersion: "1.0.1",
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
                  ui: customExample({
                    base: "ui",
                    latest: "3.2.1",
                    versions: [
                      { "3.2.1": "^1.4.0" },
                      { "2.0.0": "^1.0.0" },
                      { "1.0.0": "^1.0.0" },
                    ],
                  }),
                },
                installedCoreVersion: "1.2.6",
                expectedServerFrameworkVersion: "1.5.6",
                expectedStorageVersion: "2.0.0",
                expectedUiVersion: "2.0.0",
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
                  ui: customExample({
                    base: "ui",
                    latest: "3.2.1",
                    versions: [
                      { "3.2.1": "^1.4.0" },
                      { "2.0.0": "^1.0.0" },
                      { "1.0.0": "^1.0.0" },
                    ],
                  }),
                },
                installedCoreVersion: "1.2.6",
                expectedServerFrameworkVersion: "2.0.0",
                expectedUiVersion: "2.0.0",
                expectedStorageVersion: "1.5.6",
              },
              {
                dependencies: {
                  serverFramework: customExample({
                    base: "express",
                    latest: "2.0.0",
                    versions: [
                      { "2.0.0": "^3.5.6" },
                      { "1.5.6": "^2.0.0" },
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
                  ui: customExample({
                    base: "ui",
                    latest: "3.2.1",
                    versions: [
                      { "3.2.1": "^2.4.0" },
                      { "2.0.0": "^1.0.0" },
                      { "1.0.0": "^1.0.0" },
                    ],
                  }),
                },
                installedCoreVersion: "1.0.0",
                expectedServerFrameworkVersion: "1.0.0",
                expectedStorageVersion: "2.0.0",
                expectedUiVersion: "2.0.0",
              },
            ];

            it("should install the correct versions of the plugins", async () => {
              for (let i = 0; i < scenarios2.length; i++) {
                const scenario = scenarios2[i];

                mockInstaller.checkInstalledCoreVersion.mockResolvedValueOnce(
                  scenario.installedCoreVersion
                );

                terminal.select
                  .mockImplementationOnce(defaultTerminalSelectImpl)
                  .mockImplementationOnce(defaultTerminalSelectImpl)
                  .mockResolvedValueOnce("existing");

                registry.setNextStorageResponse(scenario.dependencies.storage);
                registry.setNextServerFrameworkResponse(
                  scenario.dependencies.serverFramework
                );

                await run();

                const calls = mockInstaller.install.mock.calls;
                expect(calls.length).toBe(i + 1);
                expect(calls[i][0].length).toBe(
                  Object.keys(scenario.dependencies).length
                );
                expect(calls[i][0]).toContain(
                  `${scenario.dependencies.storage.name}@${scenario.expectedStorageVersion}`
                );
                expect(calls[i][0]).toContain(
                  `${scenario.dependencies.serverFramework.name}@${scenario.expectedServerFrameworkVersion}`
                );
              }
            });
          });

          describe("given the installed version is not compatible with the selected plugins", () => {
            const scenarios3: {
              dependencies: {
                serverFramework: RepoDataType;
                storage: RepoDataType;
              };
              installedCoreVersion: string;
            }[] = [
              {
                dependencies: {
                  serverFramework: serverFrameworkExample,
                  storage: storageExample,
                },
                installedCoreVersion: "4.0.0",
              },
              {
                dependencies: {
                  serverFramework: customExample({
                    base: "express",
                    latest: "2.0.0",
                    versions: [
                      { "2.0.0": "~1.5.6" },
                      { "1.5.6": "^0.9.0" },
                      { "1.0.0": "^0.6.0" },
                    ],
                  }),
                  storage: customExample({
                    base: "postgresql",
                    latest: "3.2.1",
                    versions: [
                      { "3.2.1": "~1.4.0" },
                      { "2.0.0": "^0.9.0" },
                      { "1.0.0": "^0.6.0" },
                    ],
                  }),
                },
                installedCoreVersion: "1.3.0",
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
                installedCoreVersion: "2.2.6",
              },
              {
                dependencies: {
                  serverFramework: customExample({
                    base: "express",
                    latest: "2.0.0",
                    versions: [
                      { "2.0.0": "^3.5.6" },
                      { "1.5.6": "^2.0.0" },
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
                installedCoreVersion: "0.9.0",
              },
            ];

            it("should display an error message that states the first incompatible plugin", async () => {
              for (let i = 0; i < scenarios3.length; i++) {
                const scenario = scenarios3[i];

                mockInstaller.checkInstalledCoreVersion.mockResolvedValueOnce(
                  scenario.installedCoreVersion
                );

                terminal.select
                  .mockImplementationOnce(defaultTerminalSelectImpl)
                  .mockImplementationOnce(defaultTerminalSelectImpl)
                  .mockResolvedValueOnce("existing");

                registry.setNextStorageResponse(scenario.dependencies.storage);
                registry.setNextServerFrameworkResponse(
                  scenario.dependencies.serverFramework
                );

                await run();

                expect(mockInstaller.install).not.toHaveBeenCalled();
                expect(terminal.display).toHaveBeenCalledWith(
                  expect.stringContaining(`No compatible version of `)
                );
                expect(terminal.display).toHaveBeenCalledWith(
                  expect.stringContaining(
                    ` found for codewatch-core version ${scenario.installedCoreVersion}`
                  )
                );
              }
            });
          });
        });
      });
    });

    describe("given a version is specified", () => {
      describe("given such a version does not exist", () => {
        it("should display an error message and not ask the user for their plugin selection", async () => {
          const scenarios = [
            { coreRepo: coreExample, version: "1.2.3" },
            {
              coreRepo: customExample({
                base: "core",
                latest: "3.0.0",
                versions: [
                  { "1.0.0": "^1.0.0" },
                  { "2.0.0": "^1.1.0" },
                  { "3.0.0": "^1.2.0" },
                ],
              }),
              version: "3.5.0",
            },
            {
              coreRepo: customExample({
                base: "core",
                latest: "3.0.0",
                versions: [
                  { "1.0.0": "^1.0.0" },
                  { "2.0.0": "^1.1.0" },
                  { "3.0.0": "^1.2.0" },
                ],
              }),
              version: "~2.1.0",
            },
            {
              coreRepo: customExample({
                base: "core",
                latest: "3.0.0",
                versions: [
                  { "1.0.0": "^1.0.0" },
                  { "2.0.0": "^1.1.0" },
                  { "3.0.0": "^1.2.0" },
                ],
              }),
              version: "^3.1.0",
            },
          ];

          for (const scenario of scenarios) {
            registry.setNextCoreResponse(scenario.coreRepo);

            await run("install", scenario.version);

            expect(mockInstaller.install).not.toHaveBeenCalled();
            expect(terminal.select).not.toHaveBeenCalled();
            expect(terminal.display).toHaveBeenCalledWith(
              expect.stringContaining(
                `No codewatch-core version matching ${scenario.version} found`
              )
            );
          }
        });
      });

      describe("given the version exists", () => {
        describe("given the selected version is compatible with the selected plugins", () => {
          const scenarios = [
            {
              coreRepo: coreExample,
              storageRepo: storageExample,
              serverFrameworkRepo: serverFrameworkExample,
              uiRepo: uiExample,
              specifiedVersion: "1.0.0",
              expectedVersion: "1.0.0",
              expectedStorageVersion: "1.0.1",
              expectedServerFrameworkVersion: "1.0.1",
              expectedUiVersion: "1.0.1",
            },
            {
              coreRepo: customExample({
                base: "core",
                latest: "3.0.0",
                versions: [
                  { "1.0.0": "^1.0.0" },
                  { "2.0.0": "^1.1.0" },
                  { "3.0.0": "^1.2.0" },
                ],
              }),
              specifiedVersion: "2.0.0",
              expectedVersion: "2.0.0",
              storageRepo: customExample({
                base: "postgresql",
                latest: "3.2.1",
                versions: [
                  { "3.2.1": "^2.4.0" },
                  { "2.0.0": "^2.2.0" },
                  { "1.0.0": "^2.0.0" },
                ],
              }),
              expectedStorageVersion: "1.0.0",
              serverFrameworkRepo: customExample({
                base: "express",
                latest: "4.17.1",
                versions: [
                  { "4.17.1": "^3.16.0" },
                  { "3.0.0": "^2.0.0" },
                  { "2.0.0": "^2.0.0" },
                ],
              }),
              expectedServerFrameworkVersion: "3.0.0",
              uiRepo: customExample({
                base: "ui",
                latest: "4.17.1",
                versions: [
                  { "4.17.1": "^3.16.0" },
                  { "3.0.0": "^2.0.0" },
                  { "2.0.0": "^2.0.0" },
                ],
              }),
              expectedUiVersion: "3.0.0",
            },
            {
              coreRepo: customExample({
                base: "core",
                latest: "2.5.0",
                versions: [
                  { "1.0.0": "^1.0.0" },
                  { "2.0.0": "^1.1.0" },
                  { "2.5.0": "^1.2.0" },
                ],
              }),
              specifiedVersion: "^2.0.0",
              expectedVersion: "2.5.0",
              storageRepo: customExample({
                base: "postgresql",
                latest: "3.2.1",
                versions: [
                  { "3.2.1": "^2.4.0" },
                  { "2.0.0": "^2.2.0" },
                  { "1.0.0": "^2.0.0" },
                ],
              }),
              expectedStorageVersion: "3.2.1",
              serverFrameworkRepo: customExample({
                base: "express",
                latest: "4.17.1",
                versions: [
                  { "4.17.1": "^2.5.0" },
                  { "3.0.0": "^2.0.0" },
                  { "2.0.0": "^2.0.0" },
                ],
              }),
              expectedServerFrameworkVersion: "4.17.1",
              uiRepo: customExample({
                base: "ui",
                latest: "4.17.1",
                versions: [
                  { "4.17.1": "^2.5.0" },
                  { "3.0.0": "^2.0.0" },
                  { "2.0.0": "^2.0.0" },
                ],
              }),
              expectedUiVersion: "4.17.1",
            },
            {
              coreRepo: customExample({
                base: "core",
                latest: "2.5.0",
                versions: [
                  { "1.0.0": "^1.0.0" },
                  { "2.0.0": "^1.1.0" },
                  { "2.0.9": "^1.2.0" },
                ],
              }),
              specifiedVersion: "~2.0.0",
              expectedVersion: "2.0.9",
              storageRepo: customExample({
                base: "postgresql",
                latest: "3.2.1",
                versions: [
                  { "3.2.1": "^2.4.0" },
                  { "2.0.0": "^2.2.0" },
                  { "1.0.0": "~2.0.7" },
                ],
              }),
              expectedStorageVersion: "1.0.0",
              serverFrameworkRepo: customExample({
                base: "express",
                latest: "4.17.1",
                versions: [
                  { "4.17.1": "^2.5.0" },
                  { "3.0.0": "^2.0.0" },
                  { "2.0.0": "^2.0.0" },
                ],
              }),
              expectedServerFrameworkVersion: "3.0.0",
              uiRepo: customExample({
                base: "ui",
                latest: "4.17.1",
                versions: [
                  { "4.17.1": "^2.5.0" },
                  { "3.0.0": "^2.0.0" },
                  { "2.0.0": "^2.0.0" },
                ],
              }),
              expectedUiVersion: "3.0.0",
            },
          ];

          it("should install the specified version of the core and the correct versions of the selected plugins", async () => {
            for (const scenario of scenarios) {
              terminal.select
                .mockImplementationOnce(defaultTerminalSelectImpl)
                .mockImplementationOnce(defaultTerminalSelectImpl);

              registry.setNextCoreResponse(scenario.coreRepo);
              registry.setNextStorageResponse(scenario.storageRepo);
              registry.setNextServerFrameworkResponse(
                scenario.serverFrameworkRepo
              );
              registry.setNextUiResponse(scenario.uiRepo);

              await run("install", scenario.specifiedVersion);
              expect(mockInstaller.install).toHaveBeenCalledWith([
                `codewatch-core@${scenario.expectedVersion}`,
              ]);
              expect(mockInstaller.install).toHaveBeenCalledWith(
                expect.arrayContaining([
                  `${scenario.storageRepo.name}@${scenario.expectedStorageVersion}`,
                  `${scenario.serverFrameworkRepo.name}@${scenario.expectedServerFrameworkVersion}`,
                  `${scenario.uiRepo.name}@${scenario.expectedUiVersion}`,
                ])
              );
            }
          });
        });

        describe("given the selected version is not compatible with the selected plugins", () => {
          it("should not install the core or plugins, but display an error message", async () => {
            const scenarios = [
              {
                coreRepo: customExample({
                  base: "core",
                  latest: "3.0.0",
                  versions: [
                    { "1.0.0": "^1.0.0" },
                    { "2.0.0": "^1.1.0" },
                    { "3.0.0": "^1.2.0" },
                  ],
                }),
                specifiedVersion: "2.0.0",
                storageRepo: customExample({
                  base: "postgresql",
                  latest: "3.2.1",
                  versions: [
                    { "3.2.1": "^2.4.0" },
                    { "2.0.0": "^2.2.0" },
                    { "1.0.0": "^2.1.0" },
                  ],
                }),
                serverFrameworkRepo: customExample({
                  base: "express",
                  latest: "4.17.1",
                  versions: [
                    { "4.17.1": "^3.16.0" },
                    { "3.0.0": "^2.0.0" },
                    { "2.0.0": "^2.0.0" },
                  ],
                }),
                incompatiblePlugin: storageExample.name,
              },
              {
                coreRepo: customExample({
                  base: "core",
                  latest: "3.0.0",
                  versions: [
                    { "1.0.0": "^1.0.0" },
                    { "2.0.0": "^1.1.0" },
                    { "3.0.0": "^1.2.0" },
                  ],
                }),
                specifiedVersion: "2.0.0",
                storageRepo: customExample({
                  base: "postgresql",
                  latest: "3.2.1",
                  versions: [
                    { "3.2.1": "^2.4.0" },
                    { "2.0.0": "^2.2.0" },
                    { "1.0.0": "^2.0.0" },
                  ],
                }),
                serverFrameworkRepo: customExample({
                  base: "express",
                  latest: "4.17.1",
                  versions: [
                    { "4.17.1": "^3.16.0" },
                    { "3.0.0": "^2.10.0" },
                    { "2.0.0": "^2.5.0" },
                  ],
                }),
                incompatiblePlugin: serverFrameworkExample.name,
              },
              {
                coreRepo: customExample({
                  base: "core",
                  latest: "2.5.0",
                  versions: [
                    { "1.0.0": "^1.0.0" },
                    { "2.0.0": "^1.1.0" },
                    { "2.5.0": "^1.2.0" },
                  ],
                }),
                specifiedVersion: "^2.0.0",
                storageRepo: customExample({
                  base: "postgresql",
                  latest: "3.2.1",
                  versions: [
                    { "3.2.1": "^2.6.0" },
                    { "2.0.0": "^1.6.0" },
                    { "1.0.0": "1.1.0" },
                  ],
                }),
                serverFrameworkRepo: customExample({
                  base: "express",
                  latest: "4.17.1",
                  versions: [
                    { "4.17.1": "^2.5.0" },
                    { "3.0.0": "^2.0.0" },
                    { "2.0.0": "^2.0.0" },
                  ],
                }),
                incompatiblePlugin: storageExample.name,
              },
              {
                coreRepo: customExample({
                  base: "core",
                  latest: "2.5.0",
                  versions: [
                    { "1.0.0": "^1.0.0" },
                    { "2.0.0": "^1.1.0" },
                    { "2.0.9": "^1.2.0" },
                  ],
                }),
                specifiedVersion: "~2.0.0",
                storageRepo: customExample({
                  base: "postgresql",
                  latest: "3.2.1",
                  versions: [
                    { "3.2.1": "^2.4.0" },
                    { "2.0.0": "^2.2.0" },
                    { "1.0.0": "~2.0.7" },
                  ],
                }),
                serverFrameworkRepo: customExample({
                  base: "express",
                  latest: "4.17.1",
                  versions: [
                    { "4.17.1": "^2.5.0" },
                    { "3.0.0": "^2.1.0" },
                    { "2.0.0": "~2.1.0" },
                  ],
                }),
                incompatiblePlugin: serverFrameworkExample.name,
              },
            ];

            for (const scenario of scenarios) {
              terminal.select
                .mockImplementationOnce(defaultTerminalSelectImpl)
                .mockImplementationOnce(defaultTerminalSelectImpl);

              registry.setNextCoreResponse(scenario.coreRepo);
              registry.setNextStorageResponse(scenario.storageRepo);
              registry.setNextServerFrameworkResponse(
                scenario.serverFrameworkRepo
              );

              await run("install", scenario.specifiedVersion);
              expect(mockInstaller.install).not.toHaveBeenCalled();
              expect(terminal.display).toHaveBeenCalledWith(
                `No compatible version of ${scenario.incompatiblePlugin} found for codewatch-core version ${scenario.specifiedVersion}`
              );
            }
          });
        });
      });
    });
  });

  describe("given there is a new version of the installer available", () => {
    it("should display a message indicating the new version", async () => {
      const testFolder = path.join(process.cwd(), "testFolder");
      const packageJsonPath = path.join(
        testFolder,
        "codewatch-installer/package.json"
      );

      const scenarios = [
        { version: "1.0.0", latestVersion: "2.0.0" },
        { version: "2.0.0", latestVersion: "2.5.0" },
        { version: "3.0.0", latestVersion: "4.0.0" },
      ];

      for (const scenario of scenarios) {
        mockInstaller.checkInstallerVersion.mockResolvedValueOnce(
          scenario.version
        );
        registry.setNextInstallerResponse(
          customExample({
            base: "installer",
            latest: scenario.latestVersion,
          })
        );
        await run("install");

        expect(terminal.display).toHaveBeenCalledWith(
          expect.stringContaining(
            `New version of codewatch-installer available: ${scenario.latestVersion}`
          )
        );
      }
    });
  });
});
