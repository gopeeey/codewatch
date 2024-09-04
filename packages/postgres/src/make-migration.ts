import fs from "fs";
import path from "path";

const filename = process.argv[2];
if (!filename) throw new Error("Please provide a filename");

const fileContent = "--up\n\n\n--down\n\n";

const filePath = path.join(
  __dirname,
  "../migrations",
  Date.now() + "-" + filename + ".sql"
);

fs.writeFileSync(filePath, fileContent, "utf-8");
console.log(`Created migration file at ${filePath}`);
