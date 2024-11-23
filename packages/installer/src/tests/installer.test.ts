import fs from "fs";
import path from "path";
import { NpmInstaller } from "../installer";

async function seedPackageJson(json: { [key: string]: any }) {
  const filePath = path.join(
    process.cwd(),
    "node_modules/@codewatch/core/package.json"
  );

  const exists = fs.existsSync(filePath);
  if (!exists) {
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  }

  await fs.promises.writeFile(filePath, JSON.stringify(json));
}

async function cleanUp() {
  const cleanPath = path.join(process.cwd(), "node_modules/@codewatch/core");

  const exists = fs.existsSync(cleanPath);
  if (exists) {
    await fs.promises.rm(cleanPath, { recursive: true });
  }
}

afterEach(async () => {
  await cleanUp();
});

const npmInstaller = new NpmInstaller();

describe("Npm Installer", () => {
  describe("checkInstalledCoreVersion", () => {
    describe("given @codewatch/core is installed", () => {
      it("should return the installed version", async () => {
        const versions = ["1.0.0", "1.0.1", "1.0.2", "3.4.3", "3.4.4", "7.0.8"];

        for (const version of versions) {
          await seedPackageJson({
            name: "@codewatch/core",
            version,
          });

          const installedVersion =
            await npmInstaller.checkInstalledCoreVersion();
          expect(installedVersion).toBe(version);

          await cleanUp();
        }
      });
    });

    describe("given @codewatch/core is not installed", () => {
      it("should return undefined", async () => {
        const installedVersion = await npmInstaller.checkInstalledCoreVersion();
        expect(installedVersion).toBeUndefined();
      });
    });
  });
});
