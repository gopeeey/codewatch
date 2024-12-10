/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  clearMocks: true,
  transform: {},
  preset: "ts-jest/presets/js-with-ts-esm",
  transformIgnorePatterns: [],
};
