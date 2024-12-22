import { Injectable } from "@nestjs/common";
import { Config as CodewatchConfig } from "codewatch-nestjs";
import { CodewatchPgStorage } from "codewatch-postgres";

// Example config provider
@Injectable()
export class ConfigService {
  DBHOST: string;
  DBNAME: string;
  DBUSER: string;
  DBPASSWORD: string;
  DBPORT: number;

  constructor() {
    this.DBNAME = "DB_NAME";
    this.DBUSER = "DB_USER";
    this.DBPASSWORD = "DB_PASSWORD";
    this.DBHOST = "DB_HOST";
    this.DBPORT = 5432; // Please replace all these details with your actual details.
  }
  getDBHOST(): string {
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
