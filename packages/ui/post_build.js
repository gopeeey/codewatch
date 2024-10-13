import fs from "fs";
import path from "path";

const __dirname = import.meta.dirname;
const targetPath = path.join(__dirname, "dist/index.html");

const html = fs.readFileSync(targetPath, "utf-8").split("\n");
html.splice(4, 0, `<base href="<%= basePath %>" />`);

fs.writeFileSync(path.join(__dirname, "dist/index.ejs"), html.join("\n"));
fs.unlinkSync(targetPath);
console.log("Transforming: index.html -> index.ejs");
