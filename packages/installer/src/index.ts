#!/usr/bin/env node

import { select } from "@inquirer/prompts";
import { exec } from "child_process";
import ora from "ora";
import { promisify } from "util";

const execAsync = promisify(exec);

const supportedServerFrameworks = [
  "express",
  "fastify",
  "koa",
  "hapi",
  "nestjs",
] as const;
type ServerFramework = (typeof supportedServerFrameworks)[number];

const serverFrameworkChoices: { name: string; value: ServerFramework }[] = [
  { name: "Express", value: "express" },
  { name: "Fastify", value: "fastify" },
  { name: "Koa", value: "koa" },
  { name: "Hapi", value: "hapi" },
  { name: "NestJS", value: "nestjs" },
];

const supportedStorages = ["postgresql", "mongodb"] as const;
type Storage = (typeof supportedStorages)[number];

const storageChoices: { name: string; value: Storage }[] = [
  { name: "PostgreSQL", value: "postgresql" },
  { name: "MongoDB", value: "mongodb" },
];

const spinner = ora();

async function main() {
  const isLocal = process.argv[2] === "--local";

  const serverFramework = await select({
    message: "Choose a server framework:",
    choices: serverFrameworkChoices,
  });

  const storage = await select({
    message: "Choose a storage system:",
    choices: storageChoices,
  });

  try {
    await spin("Installing core", async () => {
      await installCore(isLocal);
    });

    await spin("Installing UI", async () => {
      await installUi(isLocal);
    });

    await spin(`Installing ${serverFramework} adapter`, async () => {
      await installServerFramework(serverFramework, isLocal);
    });

    await spin(`Installing ${storage} adapter`, async () => {
      await installStorage(storage, isLocal);
    });
  } catch (err) {
    console.error(err);
    spinner.stop();
    process.exit(1);
  }
}

async function installCore(isLocal: boolean) {
  if (isLocal) {
    await execAsync("yalc add @codewatch/core");
  } else {
    // await execAsync("npm install @codewatch/core");
  }
}

async function installUi(isLocal: boolean) {
  if (isLocal) {
    await execAsync("yalc add @codewatch/ui");
  } else {
    // await execAsync("npm install @codewatch/ui");
  }
}

async function installServerFramework(
  framework: ServerFramework,
  isLocal: boolean
) {
  switch (framework) {
    case "express":
      if (isLocal) {
        await execAsync("yalc add @codewatch/express");
      } else {
        // await execAsync("npm install @codewatch/express");
      }
      break;
    default:
      console.log("Not implemented yet: " + framework);
  }
}

async function installStorage(storage: Storage, isLocal: boolean) {
  switch (storage) {
    case "postgresql":
      if (isLocal) {
        await execAsync("yalc add @codewatch/postgres");
      } else {
        // await execAsync("npm install @codewatch/postgres");
      }
      break;
    default:
      console.log("Not implemented yet: " + storage);
  }
}

async function spin(text: string, action: () => Promise<void>) {
  spinner.text = text;
  spinner.start();
  await action();
  spinner.stop();
}

main();
