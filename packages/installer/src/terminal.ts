import { select } from "@inquirer/prompts";
import { exec } from "child_process";
import { promisify } from "util";
import { SelectOptions, TerminalInterface } from "./types";

const execAsync = promisify(exec);

export class Terminal implements TerminalInterface {
  async select<T extends string>({ message, options }: SelectOptions<T>) {
    return await select<T>({
      message,
      choices: options,
    });
  }

  display(message: string) {
    console.log(message);
  }

  async execute(command: string) {
    const { stdout } = await execAsync(command);
    return stdout.trim() || null;
  }
}
