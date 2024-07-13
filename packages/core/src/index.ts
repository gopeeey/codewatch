import { Occurrence, ServerAdapter, Storage } from "@codewatch/types";
import path from "path";
import { errorHandler } from "./controllers";
import { CaptureDataOpts, Core, CoreOptions } from "./core";
import { appRoutes } from "./routes";
import { mapStackToSource } from "./utils";

export interface Config extends CoreOptions {
  storage: Storage;
  serverAdapter: ServerAdapter;
}
export function initCodewatch({ storage, serverAdapter, ...config }: Config) {
  Core.init(storage, config);
  const uiBasePath = path.join(
    path.dirname(require.resolve("@codewatch/ui/package.json")),
    "dist"
  );

  serverAdapter
    .setViewsPath(uiBasePath)
    .setErrorHandler(errorHandler)
    .setStaticPath(path.join(uiBasePath, "assets"), "/assets")
    .setEntryRoute(appRoutes.entry)
    .setApiRoutes(appRoutes.api, { storage });
}

export function closeCodewatch() {
  Core.close();
}

export function captureError(err: unknown, extraData: Occurrence["extraData"]) {
  Core.captureError(err, false, extraData);
}

export function captureData(data: Record<any, any>, options?: CaptureDataOpts) {
  Core.captureData(data, options);
}

// Delete these

async function main() {
  console.log("Starting test...");

  try {
    // Simulate a failing test
    throw new Error("This is a test error");
  } catch (e) {
    console.error("Caught an error:", e);
    console.log("\n\nmapped stack trace:");
    if (e instanceof Error && e.stack) {
      const mappedStack = await mapStackToSource(e.stack);
      console.log(mappedStack);
    }
  }

  console.log("Test completed.");
}

main();
