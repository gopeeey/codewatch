import { MiddlewareConsumer, Module, NestModule, Type } from "@nestjs/common";
import { InitConfig } from "codewatch-core/dist/types";
import { ExpressAdapter } from "codewatch-express";
import { ADAPTER_PROVIDER, CONFIG_PROVIDER } from "./constants";
import { CodewatchService } from "./service";

export type Config = Omit<InitConfig, "serverAdapter">;

interface ModuleOptions {
  route: string;
  config?: Config;
  configProvider?: Type<{
    getCodewatchConfig: () => Config;
  }>;
}

@Module({
  providers: [CodewatchService],
})
export class CodewatchModule implements NestModule {
  private static _adapter: ExpressAdapter | null = null;
  private static _route: string = "";

  static forRoot(options: ModuleOptions) {
    const adapter = new ExpressAdapter();
    adapter.setBasePath(options.route);

    CodewatchModule._adapter = adapter;
    CodewatchModule._route = options.route || "";

    const defaultConfigProvider = class {
      getCodewatchConfig() {
        return options.config;
      }
    };

    return {
      module: CodewatchModule,
      providers: [
        { provide: ADAPTER_PROVIDER, useValue: adapter },
        {
          provide: CONFIG_PROVIDER,
          useClass: options.configProvider || defaultConfigProvider,
        },
      ],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    if (!CodewatchModule._adapter) return;
    consumer
      .apply(CodewatchModule._adapter.getRouter())
      .forRoutes(CodewatchModule._route);
  }
}
