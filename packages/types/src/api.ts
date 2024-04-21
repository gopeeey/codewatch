import { Storage } from "./storage";

export interface ApiRequest {
  body: Record<any, any>;
  query: Record<string, string>;
  params: Record<string, string>;
}

type BaseResponseBody = { message?: string; data?: Record<string, any> };
export interface ApiResponse<Body extends BaseResponseBody = {}> {
  status: number;
  body?: Body;
}

export type ControllerDependencies = {
  storage: Storage;
};

export type Controller<ResponseBody extends BaseResponseBody = {}> = (
  req: ApiRequest,
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
  handler: Controller;
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
}
