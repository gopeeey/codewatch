import { defineConfig } from "tsup";

export default defineConfig({
  format: ["cjs", "esm"],
  entry: [
    "./src/index.ts",
    "./src/types/index.ts",
    "./src/dev/types.ts",
    "./src/dev/storage/test/StorageTester.ts",
  ],
  dts: true,
  shims: false,
  skipNodeModulesBundle: true,
  clean: true,
  sourcemap: true,
});
