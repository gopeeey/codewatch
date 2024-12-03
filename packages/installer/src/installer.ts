import fs from "fs";
import { createRequire } from "module";
import path from "path";
import { InstallerInterface, TerminalInterface } from "./types";

const require = createRequire(import.meta.url);

export class NpmInstaller implements InstallerInterface {
  _execute: TerminalInterface["execute"];

  constructor(terminal: TerminalInterface["execute"]) {
    this._execute = terminal;
  }

  async install(dependencies: string[]): Promise<void> {
    await this._execute(`npm install codewatch-core ${dependencies.join(" ")}`);
  }

  async uninstall(dependencies: string[]): Promise<void> {
    await this._execute(`npm uninstall ${dependencies.join(" ")}`);
  }

  async checkInstalledCoreVersion(): Promise<string | undefined> {
    try {
      const packageJsonPath = require.resolve("codewatch-core/package.json", {
        paths: [process.cwd()],
      });
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

  async checkInstallerVersion(): Promise<string> {
    let npmRoot = await this._execute("npm root -g");
    if (npmRoot == null) throw new Error("Failed to find npm root");
    const packageJsonPath = path.join(
      npmRoot,
      "codewatch-installer/package.json"
    );
    const packageJsonStr = await fs.promises.readFile(packageJsonPath, "utf-8");
    const packageJson: { version: string } = JSON.parse(packageJsonStr);
    return packageJson.version;
  }
}
