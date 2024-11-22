import { exec } from "child_process";
import { promisify } from "util";
import { InstallerInterface } from "./types";

const execAsync = promisify(exec);

export class NpmInstaller implements InstallerInterface {
  async install(dependencies: string[]): Promise<void> {
    await execAsync(`npm install ${dependencies.join(" ")}`);
  }

  async checkInstalledCoreVersion(): Promise<string | undefined> {
    return "coming soon";
  }
}
