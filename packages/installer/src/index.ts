#!/usr/bin/env node

import { NpmInstaller } from "./installer";
import { Registry } from "./registry";
import { Terminal } from "./terminal";
import {
  availableCommands,
  Command,
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
  validSemver,
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
  // { name: "MongoDB", value: "mongodb" },
];

class Main {
  private _registry: RegistryInterface;
  private _terminal: TerminalInterface;
  private _installer: InstallerInterface;
  private _coreToInstall?: string;
  private _pluginsToInstall: string[] = [];
  private _existingCoreVersion?: string;
  private _useExistingCoreVersion = false;
  private _coreRepoData: RepoDataType | undefined;
  dependencies: PluginName[] = [];
  command: Command = "install";
  specifiedVersion?: string;

  constructor(
    registry: RegistryInterface,
    terminal: TerminalInterface,
    installer: InstallerInterface
  ) {
    this._registry = registry;
    this._terminal = terminal;
    this._installer = installer;
  }

  async run() {
    try {
      this._parseArgs();
      this._validateCommand();

      switch (this.command) {
        case "install":
          await this._validateSpecifiedVersion();
          await this._getPluginChoices();
          if (!this.specifiedVersion) await this._checkExistingCoreVersion();
          await this._terminal.displaySpinner(
            "Checking compatibility",
            this._getCoreAndPluginsToInstall.bind(this)
          );
          await this._install();
          break;

        case "uninstall":
          await this._installer.clearInstallation();
          break;
        // Had intentions for an "update" command, but we'll see
      }
      this._terminal.display("Done!");
      await this._checkForInstallerUpdates();
    } catch (err) {
      if (err instanceof Error) {
        this._terminal.display(err.message);
      } else {
        this._terminal.display("An unexpected error occurred");
      }
    }
  }

  private _parseArgs() {
    this.command = process.argv[2] as Command;
    this.specifiedVersion = process.argv[3];
  }

  private _validateCommand() {
    if (!availableCommands.includes(this.command)) {
      throw new Error(
        `Invalid command: ${
          this.command
        }. Please use one of the following: ${availableCommands.join(", ")}`
      );
    }
  }

  private async _validateSpecifiedVersion() {
    if (!this.specifiedVersion) return;
    if (!validSemver(this.specifiedVersion)) {
      throw new Error("Invalid version specified, please use valid semver");
    }

    this._coreRepoData = await this._registry.getCore();
    const availableVersions = Object.keys(this._coreRepoData.versions);
    if (
      availableVersions.every(
        (version) => !contains(this.specifiedVersion as string, version)
      )
    ) {
      throw new Error(
        `No codewatch-core version matching ${this.specifiedVersion} found`
      );
    }
  }

  private async _getPluginChoices() {
    const serverFramework = await this._terminal.select({
      message: "Choose a server framework:",
      options: serverFrameworkChoices,
    });

    const storage = await this._terminal.select({
      message: "Choose a storage system:",
      options: storageChoices,
    });

    this.dependencies = [serverFramework, storage, "ui"];
  }

  private async _checkExistingCoreVersion() {
    this._existingCoreVersion =
      await this._installer.checkInstalledCoreVersion();
    if (!this._existingCoreVersion) return;

    const decision = await this._terminal.select({
      message: `codewatch-core version ${this._existingCoreVersion} is already installed. Would you like to overwrite it and determine the most compatible version for you, or continue with the installed version?`,
      options: [
        {
          name: "Determine the most compatible version for me (recommended)",
          value: "overwrite",
        },
        { name: "Use installed version", value: "existing" },
      ],
    });

    this._useExistingCoreVersion = decision === "existing";
  }

  private async _getCoreAndPluginsToInstall() {
    if (!this._useExistingCoreVersion) {
      if (this.specifiedVersion) {
        if (extractSign(this.specifiedVersion).length) {
          if (!this._coreRepoData) {
            throw new Error("Failed to fetch core repository data");
          }
          const coreVersions = Object.keys(this._coreRepoData.versions)
            .filter((version) =>
              contains(this.specifiedVersion as string, version)
            )
            .sort((a, b) => {
              if (gt(a, b)) return -1;
              if (gt(b, a)) return 1;
              return 0;
            });

          if (!coreVersions.length) {
            throw new Error(
              `No core version matching ${this.specifiedVersion} found`
            );
          }

          let found = false;
          let initialError: Error | undefined;

          for (const version of coreVersions) {
            try {
              await this._findCompatiblePluginVersionForCore(version);
              this._coreToInstall = `codewatch-core@${version}`;
              found = true;
              break;
            } catch (err) {
              if (err instanceof Error && !initialError) {
                const match = err.message.match(/(codewatch-[a-zA-Z0-9_-]+)/);
                const incompatiblePlugin = match
                  ? match[0]
                  : "one of your selected plugins";
                initialError = new Error(
                  `No compatible version of ${incompatiblePlugin} found for codewatch-core version ${this.specifiedVersion}`
                );
              }
              continue;
            }
          }

          if (!found && initialError) throw initialError;
        } else {
          await this._findCompatiblePluginVersionForCore(this.specifiedVersion);
          this._coreToInstall = `codewatch-core@${this.specifiedVersion}`;
        }
      } else {
        await this._findMostCompatibleCoreAndPluginVersions();
      }
    } else {
      if (!this._existingCoreVersion) {
        throw new Error("No core version installed");
      }

      await this._findCompatiblePluginVersionForCore(this._existingCoreVersion);
    }
  }

  private async _install() {
    if (this._coreToInstall) {
      await this._terminal.displaySpinner(
        `Installing codewatch-core`,
        async () => {
          await this._installer.clearInstallation();
          await this._installer.install([this._coreToInstall as string]);
        }
      );
    }
    if (this._pluginsToInstall.length) {
      await this._terminal.displaySpinner(`Installing plugins`, async () => {
        await this._installer.install(this._pluginsToInstall);
      });
    }
  }

  private async _findMostCompatibleCoreAndPluginVersions() {
    const repos: RepoDataType[] = [];
    for (const dep of this.dependencies) {
      const repo = await this._registry.getPlugin(dep);
      repos.push(repo);
    }

    const repoGrid = repos.map((repo) => {
      const coreVersions: [string, string][] = [];
      for (const [versionNumber, versionObj] of Object.entries(repo.versions)) {
        const coreDependency = versionObj.dependencies["codewatch-core"];
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

    if (repoGrid.length !== repos.length)
      throw new Error("Dependency versions mismatch");
    repoGrid.sort((a, b) => a.deps.length - b.deps.length);

    const positions = repoGrid.map((_, index) => [0, index]);

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
                `Some of the plugins you selected are incompatible.\n${firstRow[i].name} requires codewatch-core version ${firstRow[i].deps[1]}, but ${firstRow[j].name} requires codewatch-core version ${firstRow[j].deps[1]}`
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
        // Select the version with the smallest range
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

        this._coreToInstall = `codewatch-core@${coreVersion}`;
        this._pluginsToInstall = depList;
        break;
      }
    }
  }

  private async _findCompatiblePluginVersionForCore(coreVersion: string) {
    const repos: RepoDataType[] = [];
    for (const dep of this.dependencies) {
      const repo = await this._registry.getPlugin(dep);

      repos.push(repo);
    }

    const resolvedDeps: string[] = [];

    repos.forEach((repo) => {
      const coreVersions: [string, string][] = [];
      for (const [versionNumber, versionObj] of Object.entries(repo.versions)) {
        const coreDependency = versionObj.dependencies["codewatch-core"];
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
          `No compatible version of ${repo.name} found for codewatch-core version ${coreVersion}`
        );
      }
    });

    if (resolvedDeps.length !== this.dependencies.length) {
      throw new Error("Dependency versions mismatch");
    }

    this._pluginsToInstall = resolvedDeps;
  }

  private async _checkForInstallerUpdates() {
    try {
      const installerRepo = await this._registry.getInstaller();
      const latest = installerRepo["dist-tags"].latest;
      const current = await this._installer.checkInstallerVersion();
      if (current !== latest) {
        this._terminal.display(
          `New version of codewatch-installer available: ${latest}\nPlease run 'npm update -g codewatch-installer' to update.`
        );
      }
    } catch (err) {
      // Let it fail silently for now
    }
  }
}

// if (import.meta.url === pathToFileURL(process.argv[1]).href) {
//   const registry = new Registry();
//   const terminal = new Terminal();
//   const npmInstaller = new NpmInstaller(terminal.execute);
//   const main = new Main(registry, terminal, npmInstaller);
//   main.run();
// }

const registry = new Registry();
const terminal = new Terminal();
const npmInstaller = new NpmInstaller(terminal.execute);
const main = new Main(registry, terminal, npmInstaller);
main.run();

export default Main;
