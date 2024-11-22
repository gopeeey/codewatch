#!/usr/bin/env node

import ora from "ora";
import { NpmInstaller } from "./installer";
import { Registry } from "./registry";
import { Terminal } from "./terminal";
import {
  InstallerInterface,
  PluginName,
  RegistryInterface,
  RepoDataType,
  ServerFramework,
  Storage,
  TerminalInterface,
} from "./types";
import {
  contains,
  extractSign,
  gt,
  intersects,
  lte,
  maxVersion,
} from "./utils";

const serverFrameworkChoices: { name: string; value: ServerFramework }[] = [
  { name: "Express", value: "express" },
  // { name: "Fastify", value: "fastify" },
  // { name: "Koa", value: "koa" },
  // { name: "Hapi", value: "hapi" },
  // { name: "NestJS", value: "nestjs" },
];

const storageChoices: { name: string; value: Storage }[] = [
  { name: "PostgreSQL", value: "postgresql" },
  { name: "MongoDB", value: "mongodb" },
];

const spinner = ora();

async function main(
  registry: RegistryInterface,
  terminal: TerminalInterface,
  installer: InstallerInterface
) {
  try {
    const serverFramework = await terminal.select({
      message: "Choose a server framework:",
      options: serverFrameworkChoices,
    });

    const storage = await terminal.select({
      message: "Choose a storage system:",
      options: storageChoices,
    });

    const existingCoreVersion = await installer.checkInstalledCoreVersion();
    let pluginsToInstall: string[] = [];

    const deps = [serverFramework, storage];

    if (existingCoreVersion) {
      const decision = await terminal.select({
        message: `@codewatch/core version ${existingCoreVersion} is already installed. Would you like me overwrite it and determine the most compatible version for you, or continue with the installed version?`,
        options: [
          {
            name: "Determine the most compatible version for me (recommended)",
            value: "overwrite",
          },
          { name: "Use installed version", value: "existing" },
        ],
      });

      if (decision === "overwrite") {
        const { core, plugins } = await findMostCompatibleCoreAndPluginVersions(
          deps,
          registry
        );
        await installer.install([core]);
        pluginsToInstall = plugins;
      } else {
        console.log("\n\n\nHELLO WORLD");
        pluginsToInstall = await findCompatiblePluginVersionForCore(
          deps,
          existingCoreVersion,
          registry
        );
        console.log("\n\n\nHI THRE", pluginsToInstall);
      }
    } else {
      const { core, plugins } = await findMostCompatibleCoreAndPluginVersions(
        deps,
        registry
      );

      await installer.install([core]);
      pluginsToInstall = plugins;
    }

    await installer.install(pluginsToInstall);
  } catch (err) {
    if (err instanceof Error) {
      terminal.display(err.message);
    } else {
      terminal.display("An unexpected error occurred");
    }
  }
}

async function findMostCompatibleCoreAndPluginVersions(
  deps: PluginName[],
  registry: RegistryInterface
): Promise<{
  core: string;
  plugins: string[];
}> {
  const repos: RepoDataType[] = [];
  for (const dep of deps) {
    const repo = await registry.getPlugin(dep);
    repos.push(repo);
  }

  const repoGrid = repos.map((repo) => {
    const coreVersions: [string, string][] = [];
    for (const [versionNumber, versionObj] of Object.entries(repo.versions)) {
      const coreDependency = versionObj.dependencies["@codewatch/core"];
      if (coreDependency) {
        coreVersions.push([versionNumber, coreDependency]);
      }
    }

    return {
      name: repo.name,
      deps: coreVersions.sort((a, b) => {
        const maxA = maxVersion(a[1]);
        const maxB = maxVersion(b[1]);

        if (maxA === maxB) {
          if (gt(b[1], a[1])) return 1;
          if (gt(a[1], b[1])) return -1;
          if (gt(b[0], a[0])) return 1;
          if (gt(a[0], b[0])) return -1;
          return 0;
        } else {
          if (maxA > maxB) return 1;
          return -1;
        }
      }),
    };
  });

  console.log("\n\n\n\nNEW PLACE", JSON.stringify(repoGrid));

  if (repoGrid.length !== repos.length)
    throw new Error("Dependency versions mismatch");
  repoGrid.sort((a, b) => a.deps.length - b.deps.length);

  const positions = repoGrid.map((_, index) => [0, index]);

  // console.log("\n\n\nTHESE ARE THE CURRENT VERSIONS", JSON.stringify(repoGrid));

  while (true) {
    const currentVersions = positions.map(
      (pos) => repoGrid[pos[1]].deps[pos[0]]
    );

    if (currentVersions.some((ver) => ver === undefined)) {
      // We're out of versions for a particular repo
      // Find the incompatibility in the first row and throw an error

      const firstRow = repoGrid.map((repo) => ({
        ...repo,
        deps: repo.deps[0],
      }));
      for (let i = 0; i < firstRow.length - 1; i++) {
        for (let j = 1; j < firstRow.length; j++) {
          if (!intersects([firstRow[i].deps[1], firstRow[j].deps[1]])) {
            throw new Error(
              `Some of the plugins you selected are incompatible.\n${firstRow[i].name} requires @codewatch/core version ${firstRow[i].deps[1]}, but ${firstRow[j].name} requires @codewatch/core version ${firstRow[j].deps[1]}`
            );
          }
        }
      }
    }

    const compatible = intersects(currentVersions.map((ver) => ver[1]));
    if (!compatible) {
      // Current versions are incompatible
      // Drop down the column with the largest maxed out version, then retry

      let posIndex = 0;
      let maxVal = 0;

      for (let i = 0; i < positions.length; i++) {
        const val = Number(
          maxVersion(
            repoGrid[positions[i][1]].deps[positions[i][0]][1]
          ).replace(".", "")
        );

        if (val > maxVal) {
          posIndex = i;
          maxVal = val;
        }
      }

      while (
        currentVersions.every(
          (ver) =>
            repoGrid[positions[posIndex][1]].deps[positions[posIndex][0]] !==
              undefined &&
            lte(
              ver[1],
              repoGrid[positions[posIndex][1]].deps[positions[posIndex][0]][1]
            )
        )
      ) {
        positions[posIndex][0]++;
      }
    } else {
      // Install the version with the smallest range
      let coreVersion = currentVersions[0][1];
      let maxSign = extractSign(currentVersions[0][1]);

      for (const [_, version] of currentVersions.slice(1)) {
        const sign = extractSign(version);

        if (sign === "") {
          maxSign = "";
          coreVersion = version;
          break;
        }

        switch (sign) {
          case "^":
            if (maxSign === "^") {
              coreVersion = gt(version, coreVersion) ? version : coreVersion;
            }
            break;
          case "~":
            if (maxSign === "~") {
              coreVersion = gt(version, coreVersion) ? version : coreVersion;
            } else {
              maxSign = sign;
              coreVersion = version;
            }
            break;
          default:
            throw new Error(`Unsupported semver sign ${sign}`);
        }
      }

      const depList: string[] = [];
      positions.forEach((pos) => {
        depList.push(
          `${repoGrid[pos[1]].name}@${repoGrid[pos[1]].deps[pos[0]][0]}`
        );
      });
      return {
        core: `@codewatch/core@${coreVersion}`,
        plugins: depList,
      };
    }
  }
}

async function findCompatiblePluginVersionForCore(
  deps: PluginName[],
  coreVersion: string,
  registry: RegistryInterface
): Promise<string[]> {
  const repos: RepoDataType[] = [];
  for (const dep of deps) {
    const repo = await registry.getPlugin(dep);
    repos.push(repo);
  }

  const resolvedDeps: string[] = [];

  repos.forEach((repo) => {
    const coreVersions: [string, string][] = [];
    for (const [versionNumber, versionObj] of Object.entries(repo.versions)) {
      const coreDependency = versionObj.dependencies["@codewatch/core"];
      if (coreDependency) {
        coreVersions.push([versionNumber, coreDependency]);
      }
    }

    coreVersions.sort((a, b) => {
      const maxA = maxVersion(a[1]);
      const maxB = maxVersion(b[1]);

      if (maxA === maxB) {
        if (gt(b[1], a[1])) return 1;
        if (gt(a[1], b[1])) return -1;
        if (gt(b[0], a[0])) return 1;
        if (gt(a[0], b[0])) return -1;
        return 0;
      } else {
        if (maxA > maxB) return 1;
        return -1;
      }
    });

    let found = false;
    for (const version of coreVersions) {
      if (contains(version[1], coreVersion)) {
        found = true;
        resolvedDeps.push(`${repo.name}@${version[0]}`);
        break;
      }
    }

    if (!found) {
      throw new Error(
        `No compatible version of ${repo.name} found for @codewatch/core version ${coreVersion}`
      );
    }
  });

  if (resolvedDeps.length !== deps.length) {
    throw new Error("Dependency versions mismatch");
  }
  return resolvedDeps;
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
  const npmInstaller = new NpmInstaller();
  main(registry, terminal, npmInstaller);
}

export default main;

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
