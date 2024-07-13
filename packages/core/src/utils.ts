import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import { SourceMapConsumer } from "source-map";

export function generateFingerprint(name: string, stack: string) {
  // Normalize the error stack
  const stackFrames = (stack as string)
    .replace(/\d+:\d+/g, "") // removes line and column numbers
    .split("\n")
    .slice(1);
  let normalizedStack = "";
  const cwd = process.cwd();
  for (const frame of stackFrames) {
    if (frame.includes(cwd)) {
      normalizedStack += `${frame.trim()}\n`;
    }
  }
  if (!normalizedStack.length) normalizedStack = stackFrames.join("\n");
  normalizedStack = name + "\n" + normalizedStack;
  return createHash("sha256").update(normalizedStack).digest("hex");
}

export async function mapStackToSource(stack: string) {
  const lines = stack.split("\n");
  const mappedLines = await Promise.all(
    lines.map(async (line) => {
      try {
        const match = line.match(/(.*)\((.*\.js):(\d+):(\d+)/);
        if (!match) throw new Error(`Invalid stack frame: ${line}`);

        const [_, at, file, row, column] = match;
        const rawSourceMap = await fs.promises.readFile(
          path.resolve(__dirname, `${file}.map`),
          "utf8"
        );

        const consumer = await new SourceMapConsumer(rawSourceMap);
        const pos = consumer.originalPositionFor({
          line: parseInt(row, 10),
          column: parseInt(column, 10),
        });
        consumer.destroy();
        if (pos.source) {
          return `${at}(${pos.source}:${pos.line}:${pos.column})`;
        }

        return line;
      } catch (err) {
        return line;
      }
    })
  );

  return mappedLines.join("\n");
}
