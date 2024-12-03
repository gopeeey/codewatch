const supportedServerFrameworks = [
  "express",
  // "fastify",
  // "koa",
  // "hapi",
  // "nestjs",
] as const;
export type ServerFramework = (typeof supportedServerFrameworks)[number];

const supportedStorages = ["postgresql"] as const;
export type Storage = (typeof supportedStorages)[number];

export type Dependencies = {
  serverFramework: ServerFramework;
  storage: Storage;
};

const pluginNames = [
  ...supportedServerFrameworks,
  ...supportedStorages,
  "ui",
] as const;
export type PluginName = (typeof pluginNames)[number];
export const pluginLib: { [name in PluginName]: string } = {
  express: "codewatch-express",
  postgresql: "codewatch-postgres",
  ui: "codewatch-ui",
};

export const availableCommands = ["install"] as const;
export type Command = (typeof availableCommands)[number];

export type SelectOptions<T extends string> = {
  message: string;
  options: { name: string; value: T }[];
};

export interface TerminalInterface {
  select: <T extends string>(options: SelectOptions<T>) => Promise<T>;
  display: (message: string) => void;
  displaySpinner: (text: string, action: () => Promise<void>) => Promise<void>;
  execute: (command: string) => Promise<string | null>;
}

export type RepoDataType = {
  name: string;
  "dist-tags": {
    latest: string;
  };
  versions: {
    [key: string]: {
      dependencies: {
        [key: string]: string;
      };
    };
  };
};

export interface RegistryInterface {
  getCore: () => Promise<RepoDataType>;
  getPlugin: (name: PluginName) => Promise<RepoDataType>;
  getInstaller: () => Promise<RepoDataType>;
}

export interface InstallerInterface {
  install: (dependencies: string[]) => Promise<void>;

  clearInstallation: () => Promise<void>;

  checkInstalledCoreVersion: () => Promise<string | undefined>;

  checkInstallerVersion: () => Promise<string>;
}
