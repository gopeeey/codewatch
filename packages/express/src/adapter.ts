import { ApiRequest, Context, ServerAdapter } from "codewatch-core/dist/types";
import ejs from "ejs";
import express, { NextFunction, Request, Response } from "express";

export class ExpressAdapter implements ServerAdapter {
  private _express: express.Express;
  private _basePath = "";
  private _errorHandler?: Parameters<ServerAdapter["setErrorHandler"]>[number];
  private _captureErrorFn?: Parameters<
    ServerAdapter["setCaptureErrorFn"]
  >[number];

  constructor() {
    this._express = express();
  }

  setViewsPath: ServerAdapter["setViewsPath"] = (viewsPath) => {
    this._express.set("view engine", "ejs").set("views", viewsPath);
    this._express.engine("ejs", ejs.renderFile);
    return this;
  };

  setApiRoutes: ServerAdapter["setApiRoutes"] = (routes, deps) => {
    if (!this._errorHandler) throw new Error("Set error handler first");
    this._express.use(express.json());
    const router = express.Router();

    routes.forEach((route) => {
      router[route.method](route.route, async (req, res, next) => {
        try {
          const request: ApiRequest = {
            body: req.body,
            query: req.query as ApiRequest["query"],
            params: req.params,
          };
          const result = await route.handler(request, deps);
          res.status(result.status).json(result.body || null);
        } catch (err) {
          next(err);
        }
      });
    });

    router.use(
      (err: Error, _req: Request, res: Response, next: NextFunction) => {
        if (!this._errorHandler) return next();

        const response = this._errorHandler(err);
        return res.status(response.status as 500).json(response.body);
      }
    );

    this._express.use(router);
    return this;
  };

  /**
   * Configures the base path for the dashboard routes.
   * The base path should be the same as the url passed when using the middleware from the `getRouter` function.
   */
  setBasePath: ServerAdapter["setBasePath"] = (basePath) => {
    this._basePath = basePath;
    return this;
  };

  setEntryRoute: ServerAdapter["setEntryRoute"] = (routeDef) => {
    const handler = (req: Request, res: Response) => {
      const { name, params } = routeDef.handler(this._basePath);

      res.render(name, params);
    };

    routeDef.route.forEach((route) => {
      this._express[routeDef.method](route, handler);
    });
    return this;
  };

  setErrorHandler: ServerAdapter["setErrorHandler"] = (errorHandler) => {
    this._errorHandler = errorHandler;
    return this;
  };

  setStaticPath: ServerAdapter["setStaticPath"] = (
    staticPath,
    staticsRoute
  ) => {
    this._express.use(staticsRoute, express.static(staticPath));
    return this;
  };

  setCaptureErrorFn(
    captureErrorFn: Exclude<typeof this._captureErrorFn, undefined>
  ): ServerAdapter {
    this._captureErrorFn = captureErrorFn;
    return this;
  }

  /**
   * Returns a middleware you can add to your express routes in order to access the dashboard.
   */
  getRouter() {
    return this._express;
  }

  /**
   * Returns an error handler middleware for capturing errors within routes.
   * @param handler
   *
   * When the `handler` argument is provided, this function acts as a wrapper for
   * the provided error handler, capturing and logging the error to the backend
   * before passing it on to the provided error handler. If not provided, the returned
   * error handler still logs the error, but then just passes it on to the next middleware in
   * the chain.
   */
  createErrorHandler(
    handler?: (
      error: unknown,
      req: Request,
      res: Response,
      next: NextFunction
    ) => any
  ) {
    function wrapper(
      this: ExpressAdapter,
      error: unknown,
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      function done() {
        if (handler) {
          return handler(error, req, res, next);
        } else {
          return next(error);
        }
      }

      if (!this._captureErrorFn) return done();

      const context: Context = [
        ["req.method", req.method],
        ["req.originalUrl", req.originalUrl],
        ["req.hostname", req.hostname],
        ["req.path", req.path],
        ["req.protocol", req.protocol],
      ];
      if (req.ip) context.push(["req.ip", req.ip]);

      this._captureErrorFn(error, false, undefined, context);

      done();
    }

    return wrapper.bind(this);
  }
}
