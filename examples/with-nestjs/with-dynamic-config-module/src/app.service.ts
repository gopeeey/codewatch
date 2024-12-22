import { Inject, Injectable } from "@nestjs/common";
import { captureData } from "codewatch-core";
import { ConfigService } from "./config/config.service";

@Injectable()
export class AppService {
  constructor(@Inject(ConfigService) private _config: ConfigService) {}
  getHello(): string {
    captureData(
      { foo: "bar" },
      { name: "DateFromNestJs", message: "This is some data from nestjs" },
    );
    return "Hello World!";
  }
}
