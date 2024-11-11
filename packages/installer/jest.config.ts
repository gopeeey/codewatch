/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  clearMocks: true,
  transform: {
    "^.+\\.ts?$": ["ts-jest", { tsConfig: "tsconfig.json" }],
  },
  preset: "ts-jest/presets/js-with-ts-esm",
  transformIgnorePatterns: [],
};
