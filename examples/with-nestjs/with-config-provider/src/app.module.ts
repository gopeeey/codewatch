import { Module } from "@nestjs/common";
import { CodewatchModule } from "codewatch-nestjs";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigService } from "./providers/config.service";

@Module({
  imports: [
    CodewatchModule.forRoot({
      route: "/code",
      configProvider: ConfigService,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
