import { Module } from "@nestjs/common";
import { CodewatchModule } from "codewatch-nestjs";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "./config/config.module";
import { ConfigService } from "./config/config.service";

// Configure the path where the config service should find
// the .env file. Don't forget to add a .env file on this path.
const configModule = ConfigModule.forRoot({
  path: join(process.cwd(), ".env"),
});

@Module({
  imports: [
    configModule,
    CodewatchModule.forRoot({
      route: "/code",
      configModule, // Specify the module to use
      configProvider: ConfigService, // Specify the provider in the module to use
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
