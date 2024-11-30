import { CaptureDataOpts, InitConfig, Occurrence } from "@types";
import { createRequire } from "module";
import path from "path";
import { errorHandler } from "./controllers";
import { Core } from "./core";
import { appRoutes } from "./routes";

const require = createRequire(import.meta.url);

export function init({ storage, serverAdapter, ...config }: InitConfig) {
  try {
    const uiBasePath = path.join(
      path.dirname(require.resolve("codewatch-ui/package.json")),
      "dist"
    );

    Core.init(storage, config);

    serverAdapter
      .setViewsPath(uiBasePath)
      .setErrorHandler(errorHandler)
      .setStaticPath(path.join(uiBasePath, "assets"), "/assets")
      .setEntryRoute(appRoutes.entry)
      .setApiRoutes(appRoutes.api, { storage });
  } catch (err) {
    console.error("Failed to initialize codewatch");
    throw err;
  }
}

export function close() {
  Core.close();
}

export function captureError(
  err: unknown,
  extraData?: Occurrence["extraData"]
) {
  Core.captureError(err, false, extraData);
}

export function captureData(data: Record<any, any>, options?: CaptureDataOpts) {
  Core.captureData(data, options);
}
