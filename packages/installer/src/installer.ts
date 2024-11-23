import { exec } from "child_process";
import fs from "fs";
import { promisify } from "util";
import { InstallerInterface } from "./types";

const execAsync = promisify(exec);

export class NpmInstaller implements InstallerInterface {
  async install(dependencies: string[]): Promise<void> {
    await execAsync(`npm install ${dependencies.join(" ")}`);
  }

  async checkInstalledCoreVersion(): Promise<string | undefined> {
    try {
      const packageJsonPath = require.resolve("@codewatch/core/package.json");
      const packageJsonStr = await fs.promises.readFile(
        packageJsonPath,
        "utf-8"
      );
      const packageJson: { version: string } = JSON.parse(packageJsonStr);
      return packageJson.version;
    } catch (err) {
      return undefined;
    }
  }
}
