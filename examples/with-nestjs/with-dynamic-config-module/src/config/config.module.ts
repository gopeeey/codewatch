import { Module } from "@nestjs/common";
import { LoggerModule } from "src/logger/logger.module";
import { ConfigService } from "./config.service";
import { CONFIG_OPTIONS_PROVIDER } from "./constants";

@Module({})
export class ConfigModule {
  static forRoot(options: { path: string }) {
    return {
      module: ConfigModule,
      imports: [LoggerModule],
      providers: [
        { provide: CONFIG_OPTIONS_PROVIDER, useValue: options },
        ConfigService,
      ],
      // Ensure to export the config service itself, as well as the dependencies it injects
      exports: [ConfigService, CONFIG_OPTIONS_PROVIDER, LoggerModule],
    };
  }
}
