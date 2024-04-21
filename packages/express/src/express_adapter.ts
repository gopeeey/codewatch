import { ApiRequest, ServerAdapter } from "@codewatch/types";
import ejs from "ejs";
import express, { NextFunction, Request, Response } from "express";

export class ExpressAdapter implements ServerAdapter {
  private _express: express.Express;
  private _basePath = "";
  private _errorHandler?: Parameters<ServerAdapter["setErrorHandler"]>[number];

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

  getRouter() {
    return this._express;
  }
}
