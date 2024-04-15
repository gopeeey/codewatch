import { CoreOptions } from "./core";
import { ServerAdapter, Storage } from "./types";

export { entryPoint, errorHandler } from "./controllers";
export * from "./core";
export * from "./routes";
export * from "./types";

export interface Config extends CoreOptions {
  storage: Storage;
  serverAdapter: ServerAdapter;
}
export function initCodewatch(config: Config) {}
