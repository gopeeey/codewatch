import fs from "fs";
import path from "path";

export async function seedPackageJson(
  json: { [key: string]: any },
  location: string
) {
  const exists = fs.existsSync(location);
  if (!exists) {
    await fs.promises.mkdir(path.dirname(location), { recursive: true });
  }

  await fs.promises.writeFile(location, JSON.stringify(json));
}

export async function deleteFolder(location: string) {
  const exists = fs.existsSync(location);
  if (exists) {
    await fs.promises.rm(location, { recursive: true });
  }
}
