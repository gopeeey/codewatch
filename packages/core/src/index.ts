import path from "path";
import { errorHandler } from "./controllers";
import { Core, CoreOptions } from "./core";
import { appRoutes } from "./routes";
import { ServerAdapter, Storage } from "./types";

export { entryPoint, errorHandler } from "./controllers";
export * from "./core";
export * from "./routes";
export * from "./types";

export interface Config extends CoreOptions {
  storage: Storage;
  serverAdapter: ServerAdapter;
}
export function initCodewatch({ storage, serverAdapter, ...config }: Config) {
  Core.init(storage, config);
  const uiBasePath = path.dirname(
    eval(`require.resolve('@codewatch/ui/package.json')`)
  );

  serverAdapter
    .setViewsPath(uiBasePath)
    .setStaticPath(path.join(uiBasePath, "assets"), "/assets")
    .setEntryRoute(appRoutes.entry.route, appRoutes.entry.handler)
    .setApiRoutes(appRoutes.api)
    .setErrorHandler(errorHandler);
}

export function closeCodewatch() {
  Core.close();
}

export function captureError(err: unknown) {
  Core.handleError(err, false);
}
