import { defineConfig } from "tsup";

export default defineConfig({
  format: ["esm"],
  entry: ["./src/index.ts", "./src/utils.ts"],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  clean: true,
  sourcemap: true,
});
