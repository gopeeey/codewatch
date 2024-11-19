import { select } from "@inquirer/prompts";
import { SelectOptions, TerminalInterface } from "./types";

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
}
