import { Inject, Injectable } from "@nestjs/common";
import { Config as CodewatchConfig } from "codewatch-nestjs";
import { CodewatchPgStorage } from "codewatch-postgres";
import { config as dotenvConfig } from "dotenv";
import { LoggerService } from "src/logger/logger.service";
import { CONFIG_OPTIONS_PROVIDER } from "./constants";

@Injectable()
export class ConfigService {
  DBHOST: string;
  DBNAME: string;
  DBUSER: string;
  DBPASSWORD: string;
  DBPORT: number;

  // This service injects the LoggerService and config options
  constructor(
    private logger: LoggerService,
    @Inject(CONFIG_OPTIONS_PROVIDER) private options: { path: string },
  ) {
    // Load environment variables from a .env file on the specified path.
    // Don't forget to add a .env file on this path.
    dotenvConfig(options);
    const env = process.env;
    this.DBNAME = env.POSTGRES_DB_NAME;
    this.DBUSER = env.POSTGRES_DB_USERNAME;
    this.DBPASSWORD = env.POSTGRES_DB_PASSWORD;
    this.DBHOST = env.POSTGRES_DB_HOST;
    this.DBPORT = Number(env.POSTGRES_DB_PORT);
  }
  getDBHOST(): string {
    this.logger.log("Hello world");
    return this.DBHOST;
  }

  // Ensure the provider implements a getCodewatchConfig method that returns a CodewatchConfig object
  getCodewatchConfig(): CodewatchConfig {
    return {
      storage: new CodewatchPgStorage({
        user: this.DBUSER,
        host: this.DBHOST,
        database: this.DBNAME,
        password: this.DBPASSWORD,
        port: this.DBPORT,
      }),
    };
  }
}
