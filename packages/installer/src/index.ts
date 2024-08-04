#!/usr/bin/env node

import { select } from "@inquirer/prompts";
import { exec as unPromisifiedExec } from "child_process";
import ora from "ora";
import { promisify } from "util";

const exec = promisify(unPromisifiedExec);

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
  const serverFramework = await select({
    message: "Choose a server framework:",
    choices: serverFrameworkChoices,
  });

  const storage = await select({
    message: "Choose a storage system:",
    choices: storageChoices,
  });

  try {
    await spin("Installing core", installCore);

    await spin("Installing UI", installUi);

    await spin(`Installing ${serverFramework} adapter`, async () => {
      await installServerFramework(serverFramework);
    });

    await spin(`Installing ${storage} adapter`, async () => {
      await installStorage(storage);
    });
  } catch (err) {
    console.error(err);
    spinner.stop();
    process.exit(1);
  }
}

async function installCore() {
  await exec("yalc add @codewatch/core");
  // await exec("npm install @codewatch/core");
}

async function installUi() {
  await exec("yalc add @codewatch/ui");
  // await exec("npm install @codewatch/ui");
}

async function installServerFramework(framework: ServerFramework) {
  switch (framework) {
    case "express":
      await exec("yalc add @codewatch/express");
      // await exec("npm install @codewatch/express");
      break;
    default:
      console.log("Not implemented yet: " + framework);
  }
}

async function installStorage(storage: Storage) {
  switch (storage) {
    case "postgresql":
      await exec("yalc add @codewatch/postgres");
      // await exec("npm install @codewatch/postgres");
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
