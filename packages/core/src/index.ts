import { CaptureDataOpts, InitConfig, Occurrence } from "@types";
import { createRequire } from "module";
import path from "path";
import { errorHandler } from "./controllers";
import { Core } from "./core";
import { appRoutes } from "./routes";

const require = createRequire(import.meta.url || __filename);

/**
 * Initializes the codewatch core and plugins
 * @param {InitConfig} config - Specifies storage, server adapter, and other plugins, as well as other configurable options.
 *
 */
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
      .setApiRoutes(appRoutes.api, { storage })
      .setCaptureErrorFn(Core.captureError);
  } catch (err) {
    console.error("Failed to initialize codewatch");
    throw err;
  }
}

/**
 * Closes the codewatch core and plugins
 *
 */
export function close() {
  Core.close();
}

/**
 * Captures an error and logs it to the configured storage.
 * @param {Error|unknown} err - The error to capture.
 * @param {Occurrence["extraData"]} extraData - Additional data to include with the error.
 *
 */
export async function captureError(
  err: unknown,
  extraData?: Occurrence["extraData"]
) {
  await Core.captureError(err, false, extraData);
}

/**
 * Captures additional data and logs it to the configured storage.
 * @param {Record<any, any>} data - The data to capture.
 * @param {CaptureDataOpts} [options] - Additional options for capturing the data.
 *
 */
export async function captureData(
  data: Record<any, any>,
  options?: CaptureDataOpts
) {
  await Core.captureData(data, options);
}
