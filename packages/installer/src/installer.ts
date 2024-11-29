import { exec } from "child_process";
import fs from "fs";
import { createRequire } from "module";
import path from "path";
import { promisify } from "util";
import { InstallerInterface, TerminalInterface } from "./types";

const require = createRequire(import.meta.url);
const execAsync = promisify(exec);

export class NpmInstaller implements InstallerInterface {
  _execute: TerminalInterface["execute"];

  constructor(terminal: TerminalInterface["execute"]) {
    this._execute = terminal;
  }

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

  async checkInstallerVersion(): Promise<string> {
    let npmRoot = await this._execute("npm root -g");
    if (npmRoot == null) throw new Error("Failed to find npm root");
    const packageJsonPath = path.join(
      npmRoot,
      "@codewatch/installer/package.json"
    );
    const packageJsonStr = await fs.promises.readFile(packageJsonPath, "utf-8");
    const packageJson: { version: string } = JSON.parse(packageJsonStr);
    return packageJson.version;
  }
}
