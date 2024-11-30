import { PluginName, RepoDataType } from "../types";

export const coreExample: RepoDataType = {
  name: "codewatch-core",
  "dist-tags": {
    latest: "1.0.1",
  },
  versions: {
    "1.0.0": {
      dependencies: {},
    },
    "1.0.1": {
      dependencies: {},
    },
  },
};

export const storageExample: RepoDataType = {
  name: "@codewatch/postgres",
  "dist-tags": {
    latest: "1.0.1",
  },
  versions: {
    "1.0.0": {
      dependencies: {
        "codewatch-core": "^1.0.0",
      },
    },
    "1.0.1": {
      dependencies: {
        "codewatch-core": "^1.0.0",
      },
    },
  },
};

export const serverFrameworkExample: RepoDataType = {
  name: "@codewatch/express",
  "dist-tags": {
    latest: "1.0.1",
  },
  versions: {
    "1.0.0": {
      dependencies: {
        "codewatch-core": "^1.0.0",
      },
    },
    "1.0.1": {
      dependencies: {
        "codewatch-core": "^1.0.0",
      },
    },
  },
};

export const installerExample: RepoDataType = {
  name: "@codewatch/installer",
  "dist-tags": {
    latest: "1.0.1",
  },
  versions: {
    "1.0.0": {
      dependencies: {},
    },
    "1.0.1": {
      dependencies: {},
    },
  },
};

type CustomExampleArgs = {
  base: "core" | "installer" | PluginName;
  latest?: string;
  versions?: {
    [key: string]: string; // key is the version, value is the core version
  }[];
};
export function customExample({
  base,
  latest,
  versions,
}: CustomExampleArgs): RepoDataType {
  let example: RepoDataType;

  switch (base) {
    case "core":
      example = structuredClone(coreExample);
      break;
    case "postgresql":
      example = structuredClone(storageExample);
      break;
    case "express":
      example = structuredClone(serverFrameworkExample);
      break;
    case "installer":
      example = structuredClone(installerExample);
      break;
    default:
      throw new Error(`Invalid base type: ${base}`);
  }

  if (latest) {
    example["dist-tags"].latest = latest;
  }

  if (versions) {
    example.versions = {};
    versions.forEach((versionData) => {
      const [version, coreVersion] = Object.entries(versionData)[0];
      example.versions[version] = {
        dependencies: {
          "codewatch-core": coreVersion,
        },
      };
    });
  }

  return example;
}
