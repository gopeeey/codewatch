import { select } from "@inquirer/prompts";
import { exec } from "child_process";
import ora from "ora";
import { promisify } from "util";
import { SelectOptions, TerminalInterface } from "./types";
const execAsync = promisify(exec);

export class Terminal implements TerminalInterface {
  private _spinner = ora();

  async select<T extends string>({ message, options }: SelectOptions<T>) {
    return await select<T>({
      message,
      choices: options,
    });
  }

  display(message: string) {
    console.log(message);
  }

  async displaySpinner(
    text: string,
    action: () => Promise<void>
  ): Promise<void> {
    this._spinner.text = text;
    try {
      this._spinner.start();
      await action();
      this._spinner.stop();
    } catch (err) {
      this._spinner.stop();
      throw err;
    }
  }

  async execute(command: string) {
    const { stdout } = await execAsync(command);
    return stdout.trim() || null;
  }
}
