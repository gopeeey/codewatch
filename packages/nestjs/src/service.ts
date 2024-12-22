import { Inject, Injectable } from "@nestjs/common";
import { init } from "codewatch-core";
import { InitConfig } from "codewatch-core/dist/types";
import { ExpressAdapter } from "codewatch-express";
import { ADAPTER_PROVIDER, CONFIG_PROVIDER } from "./constants";

@Injectable()
export class CodewatchService {
  constructor(
    @Inject(ADAPTER_PROVIDER) private _adapter: ExpressAdapter,
    @Inject(CONFIG_PROVIDER)
    private _configProvider: {
      getCodewatchConfig: () => Omit<InitConfig, "serverAdapter">;
    },
  ) {
    let config = this._configProvider.getCodewatchConfig();
    if (!config) {
      throw new Error("Please provide a config object for codewatch.");
    }

    init({
      ...config,
      serverAdapter: this._adapter,
    });
  }
}
