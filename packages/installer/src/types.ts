const supportedServerFrameworks = [
  "express",
  // "fastify",
  // "koa",
  // "hapi",
  // "nestjs",
] as const;
export type ServerFramework = (typeof supportedServerFrameworks)[number];

const supportedStorages = ["postgresql", "mongodb"] as const;
export type Storage = (typeof supportedStorages)[number];

export type Dependencies = {
  serverFramework: ServerFramework;
  storage: Storage;
};

const pluginNames = [
  ...supportedServerFrameworks,
  ...supportedStorages,
] as const;
export type PluginName = (typeof pluginNames)[number];

export type SelectOptions<T extends string> = {
  message: string;
  options: { name: string; value: T }[];
};

export interface TerminalInterface {
  select: <T extends string>(options: SelectOptions<T>) => Promise<T>;
  display: (message: string) => void;
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
}

export type InstallFn = (dependencies: string[]) => Promise<void>;
