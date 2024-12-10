/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  clearMocks: true,
  transform: {},
  preset: "ts-jest/presets/js-with-ts-esm",
  transformIgnorePatterns: [],
};
