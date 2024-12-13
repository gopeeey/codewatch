import { Occurrence } from "./base";
import { Storage } from "./storage";

type ReqBody = Record<any, any>;
type ReqQuery = Record<string, string>;
type ReqParams = Record<string, string>;
export interface ApiRequest<
  Body extends ReqBody = ReqBody,
  Query extends ReqQuery = ReqBody,
  Params extends ReqParams = ReqBody
> {
  body: Body;
  query: Query;
  params: Params;
}

type BaseResponseBody = { message?: string; data?: Record<string, any> };
export interface ApiResponse<Body extends BaseResponseBody = {}> {
  status: number;
  body?: Body;
}

export type ControllerDependencies = {
  storage: Storage;
};

export type Controller<
  ResponseBody extends BaseResponseBody = BaseResponseBody,
  RequestBody extends ReqBody = ReqBody,
  RequestQuery extends ReqQuery = ReqBody,
  RequestParams extends ReqParams = ReqBody
> = (
  req: ApiRequest<RequestBody, RequestQuery, RequestParams>,
  deps: ControllerDependencies
) => Promise<ApiResponse<ResponseBody>>;

export type ViewController = (basePath: string) => {
  name: string;
  params: Record<string, string>;
};

export type ErrorHandler = (error: unknown) => ApiResponse;

export interface ApiRoute {
  route: string | string[];
  method: "get" | "post" | "put" | "delete";
  handler: Controller<any, any, any, any>;
}

export interface ViewRoute {
  route: string[];
  method: "get";
  handler: ViewController;
}

export interface AppRoutes {
  entry: ViewRoute;
  api: ApiRoute[];
}

type errorHandler = (
  err: unknown,
  unhandled?: boolean,
  extraData?: Occurrence["extraData"]
) => Promise<void>;

export interface ServerAdapter {
  setBasePath: (basePath: string) => ServerAdapter;
  setViewsPath: (viewsPath: string) => ServerAdapter;
  setStaticPath: (staticsPath: string, staticsRoute: string) => ServerAdapter;
  setEntryRoute: (entryRoute: ViewRoute) => ServerAdapter;
  setErrorHandler: (errorHandler: ErrorHandler) => ServerAdapter;
  setApiRoutes: (
    routes: ApiRoute[],
    deps: ControllerDependencies
  ) => ServerAdapter;
  setCaptureErrorFn: (
    captureErrorFn: (
      err: unknown,
      unhandled?: boolean,
      extraData?: Occurrence["extraData"],
      context?: Occurrence["context"]
    ) => Promise<void>
  ) => ServerAdapter;
}
