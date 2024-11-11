import { RepoDataType } from "../types";

export const coreExample: RepoDataType = {
  name: "@codewatch/core",
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
        "@codewatch/core": "^1.0.0",
      },
    },
    "1.0.1": {
      dependencies: {
        "@codewatch/core": "^1.0.0",
      },
    },
  },
};
