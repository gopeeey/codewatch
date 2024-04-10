import axios, { AxiosError } from "axios";
import { HttpError } from "./errors";

interface ClientConfigInterface {
  baseUrl?: string;
}

interface PostRequestArgsInterface {
  url: string;
  body: { [key: string]: unknown };
}

export class HttpClient {
  private readonly _baseUrl: Exclude<
    ClientConfigInterface["baseUrl"],
    undefined
  > = window.__basePath__ + "api";

  constructor(args?: ClientConfigInterface) {
    if (args) {
      if (args.baseUrl) this._baseUrl += args.baseUrl;
    }
  }

  static errorHandler(err: unknown): never {
    if (err instanceof AxiosError) {
      const httpError = new HttpError({
        message: err.response?.data?.message || err.message,
        data: err.response?.data,
      });
      if (err.code) httpError.statusCode = parseInt(err.code, 10);

      throw httpError;
    }

    if (err instanceof Error) {
      const httpError = new HttpError({
        message: err.message,
      });

      throw httpError;
    }

    throw err;
  }

  async post<ResDataType>(args: PostRequestArgsInterface) {
    try {
      const url = this._baseUrl + args.url;
      const res = await axios.post(url, args.body);
      return res.data as ResDataType;
    } catch (err) {
      HttpClient.errorHandler(err);
    }
  }

  async get<ResDataType>(url: string) {
    try {
      const fullUrl = this._baseUrl + url;
      const res = await axios.get(fullUrl);
      return res.data as ResDataType;
    } catch (err) {
      HttpClient.errorHandler(err);
    }
  }
}
