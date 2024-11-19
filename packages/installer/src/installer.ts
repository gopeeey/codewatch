import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function npmInstall(dependencies: string[]): Promise<void> {
  await execAsync(`npm install ${dependencies.join(" ")}`);
}
