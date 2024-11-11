#!/usr/bin/env node

import { exec } from "child_process";
import ora from "ora";
import { promisify } from "util";
import { Registry } from "./registry";
import { Terminal } from "./terminal";
import {
  RegistryInterface,
  ServerFramework,
  Storage,
  TerminalInterface,
} from "./types";

const execAsync = promisify(exec);

const serverFrameworkChoices: { name: string; value: ServerFramework }[] = [
  { name: "Express", value: "express" },
  { name: "Fastify", value: "fastify" },
  { name: "Koa", value: "koa" },
  { name: "Hapi", value: "hapi" },
  { name: "NestJS", value: "nestjs" },
];

const storageChoices: { name: string; value: Storage }[] = [
  { name: "PostgreSQL", value: "postgresql" },
  { name: "MongoDB", value: "mongodb" },
];

const spinner = ora();

async function main(registry: RegistryInterface, terminal: TerminalInterface) {
  const isLocal = process.argv[2] === "--local";

  const serverFramework = await terminal.select({
    message: "Choose a server framework:",
    options: serverFrameworkChoices,
  });

  const storage = await terminal.select({
    message: "Choose a storage system:",
    options: storageChoices,
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

if (require.main === module) {
  const registry = new Registry();
  const terminal = new Terminal();
  main(registry, terminal);
}

export default main;
// Install (fresh install no existing core version):
// Ask for user's stack and determine latest most compatible core version
// Install that core version
// Install dependencies that are compatible with that core version

// Install (a core version is already installed):
// Ask for user's stack and determine latest most compatible core version
// Check if the determined core version is greater than the installed version
// If yes, ask the user if they want to install that latest version
// Install dependencies that are compatible with the chosen core version

// Install --version:
// Ask for user's stack
// Determine if each of the dependencies are compatible with the specified core version (if there's a version of the dependecy for the specified core version)
// Check if the specified version exists
// If not, throw an error
// If yes, install the specified version
// Update dependencies that are compatible with the new core version

// Update:
// Update the core version to the latest
// Update dependencies that are compatible with the new core version
