import { ServerAdapter } from "./api";
import { Storage } from "./storage";

export type CoreOptions = {
  stdoutLogRetentionTime?: number;
  stderrLogRetentionTime?: number;
  disableConsoleLogs?: boolean;
};

export type CaptureDataOpts = {
  name?: string;
  message?: string;
};

export interface InitConfig extends CoreOptions {
  storage: Storage;
  serverAdapter: ServerAdapter;
}
