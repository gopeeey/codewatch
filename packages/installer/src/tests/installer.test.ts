import path from "path";
import { NpmInstaller } from "../installer";
import { TerminalMock } from "./mocks";
import { deleteFolder, seedPackageJson } from "./utils";

const seedFilePath = path.join(
  process.cwd(),
  "node_modules/codewatch-core/package.json"
);
const deleteFolderPath = path.dirname(seedFilePath);

afterEach(async () => {
  await deleteFolder(deleteFolderPath);
});

const terminal = new TerminalMock();
const npmInstaller = new NpmInstaller(terminal.execute);

describe("Npm Installer", () => {
  describe("checkInstalledCoreVersion", () => {
    describe("given codewatch-core is installed", () => {
      it("should return the installed version", async () => {
        const versions = ["1.0.0", "1.0.1", "1.0.2", "3.4.3", "3.4.4", "7.0.8"];

        for (const version of versions) {
          await seedPackageJson(
            { name: "codewatch-core", version },
            seedFilePath
          );

          const installedVersion =
            await npmInstaller.checkInstalledCoreVersion();
          expect(installedVersion).toBe(version);

          await deleteFolder(deleteFolderPath);
        }
      });
    });

    describe("given codewatch-core is not installed", () => {
      it("should return undefined", async () => {
        const installedVersion = await npmInstaller.checkInstalledCoreVersion();
        expect(installedVersion).toBeUndefined();
      });
    });
  });

  describe("checkInstallerVersion", () => {
    const testFolder = path.join(process.cwd(), "testFolder");

    afterEach(async () => {
      await deleteFolder(testFolder);
    });

    it("should return the installed version of the installer", async () => {
      const packageJsonPath = path.join(
        testFolder,
        "@codewatch/installer/package.json"
      );
      const versions = ["1.0.0", "1.0.1", "1.0.2", "3.4.3", "3.4.4", "7.0.8"];

      for (const version of versions) {
        terminal.execute.mockResolvedValueOnce(testFolder);

        await seedPackageJson({ version: version }, packageJsonPath);

        const expectedVersion = await npmInstaller.checkInstallerVersion();

        await deleteFolder(testFolder);

        expect(expectedVersion).toBe(version);
      }
    });
  });
});
