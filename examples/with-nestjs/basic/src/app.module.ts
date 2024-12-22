import { Module } from "@nestjs/common";
import { CodewatchModule } from "codewatch-nestjs";
import { CodewatchPgStorage } from "codewatch-postgres";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    CodewatchModule.forRoot({
      route: "/code", // The route to access the dashboard from
      config: {
        storage: new CodewatchPgStorage({
          user: "USER_NAME",
          host: "HOST",
          database: "DATABASE_NAME",
          password: "DATABASE_PASSWORD",
          port: 5432, // Please replace all these details with your actual details.
        }),
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
