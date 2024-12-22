import { Injectable } from "@nestjs/common";
import { captureData } from "codewatch-core";

@Injectable()
export class AppService {
  getHello(): string {
    captureData(
      { foo: "bar" },
      { name: "DateFromNestJs", message: "This is some data from nestjs" },
    );
    return "Hello World!";
  }
}
