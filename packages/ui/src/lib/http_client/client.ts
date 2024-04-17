import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";

interface ClientConfigInterface {
  baseUrl?: string;
}

interface PostRequestArgsInterface {
  url: string;
  body: object;
}

export class HttpClient {
  private readonly _baseUrl: Exclude<
    ClientConfigInterface["baseUrl"],
    undefined
  > = "api";

  private readonly _axios: Axios;

  constructor(args?: ClientConfigInterface) {
    if (args) {
      if (args.baseUrl) this._baseUrl += args.baseUrl;
    }

    this._axios = axios.create({ baseURL: this._baseUrl });
  }

  private errorHandler(err: unknown) {
    let message = "Sorry an error occurred";

    if (err instanceof AxiosError) {
      message = err.response?.data?.message || err.message;
      if (err.response?.data.data) console.log(err.response.data.data);
    } else if (err instanceof Error) {
      message = err.message;
    }

    toast.error(message, { autoClose: 4000 });
    return { error: true as const };
  }

  handleResponse<ResDataType>(res: AxiosResponse) {
    return { error: false as const, data: res.data.data as ResDataType };
  }

  async post<ResDataType>(args: PostRequestArgsInterface) {
    try {
      const res = await this._axios.post(args.url, args.body);
      return this.handleResponse<ResDataType>(res);
    } catch (err) {
      return this.errorHandler(err);
    }
  }

  async get<ResDataType>(url: string) {
    try {
      const res = await this._axios.get(url);
      return this.handleResponse<ResDataType>(res);
    } catch (err) {
      return this.errorHandler(err);
    }
  }

  async put<ResDataType>(args: PostRequestArgsInterface) {
    try {
      const res = await this._axios.put(args.url, args.body);
      return this.handleResponse<ResDataType>(res);
    } catch (err) {
      return this.errorHandler(err);
    }
  }

  async delete<ResDataType>(url: string) {
    try {
      const res = await this._axios.delete(url);
      return this.handleResponse<ResDataType>(res);
    } catch (err) {
      return this.errorHandler(err);
    }
  }
}
