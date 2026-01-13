import express, {
  Application,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import {
  ParamDefinition,
  RouteDefinition,
  ArgumentMetadata,
} from '../common/controllers/controllers.type';
import { Container } from './di/container';
import {
  CONTROLLER,
  ROUTE,
  ROUTE_PARAMS,
  RES_HTTP_CODE,
  FILTERS_CATCH,
} from '../constant/metadata.constant';
import { ExecutionContext } from './http/execution-context';
import cors, { CorsOptions } from 'cors';
import { PipeTransform } from '../common/pipes/pipe-transform';
import { Interceptor } from '../common/interceptors/interceptor';
import { ExceptionFilter } from '../common/filters/exception-filter';
import { CanActivate } from '../common/guards/can-activate';
import { getPipesMetadata } from '../common/pipes/pipes.metadata';
import { getGuardsMetadata } from '../common/guards/guards.metadata';
import { getInterceptorsMetadata } from '../common/interceptors/interceptors.metadata';
import { getFiltersMetadata } from '../common/filters/filters.metadata';
import { getModuleMetadata } from '../common/modules/modules.decorator';

export class MyExpressApp {
  private app: Application;
  private container: Container;

  private globalPrefix: string = '';
  private globalPipes: Array<PipeTransform> = [];
  private globalInterceptors: Array<Interceptor> = [];
  private globalFilters: Array<ExceptionFilter> = [];

  constructor(private rootModule: any) {
    this.app = express();
    this.container = new Container();

    // Default middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use((err: any, _: any, res: Response, next: NextFunction) => {
      if (err.type === 'entity.parse.failed') {
        res.status(400).json({
          message: 'Invalid json',
        });
      }
      next(err);
    });

    this.loadModule = this.loadModule.bind(this);
  }

  private loadModule(module: any) {
    const { imports, providers, controllers } = getModuleMetadata(module);

    imports.forEach(this.loadModule);
    providers.forEach((p: any) => this.container.register(p));
    controllers.forEach((c: any) => {
      this.registerController(c);
    });
  }

  setGlobalPrefix(prefix: string) {
    this.globalPrefix = prefix;
    return this;
  }

  useGlobalPipes(...pipes: (new (...args: any[]) => PipeTransform)[]) {
    const resolvedPipes = pipes.map((p) =>
      this.container.resolve<PipeTransform>(p),
    );
    this.globalPipes.push(...resolvedPipes);
    return this;
  }

  useGlobalFilters(...filters: (new (...args: any[]) => ExceptionFilter)[]) {
    const resolvedFilters = filters.map((f) =>
      this.container.resolve<ExceptionFilter>(f),
    );
    this.globalFilters.push(...resolvedFilters);
    return this;
  }

  useGlobalInterceptors(
    ...interceptors: (new (...args: any[]) => Interceptor)[]
  ) {
    const resolvedInterceptors = interceptors.map((i) =>
      this.container.resolve<Interceptor>(i),
    );
    this.globalInterceptors.push(...resolvedInterceptors);

    return this;
  }

  registerController(controller: any): void {
    const basePath = Reflect.getMetadata(CONTROLLER, controller);
    const routes = Reflect.getMetadata(ROUTE, controller) || [];

    const router = Router();
    const requestContainer = this.container.createRequestScope();
    const controllerInstance = requestContainer.resolve(controller);

    routes.forEach((route: RouteDefinition) => {
      const handler = this.createRouteHandler(
        controllerInstance,
        route.methodName,
      );

      const fullPath = `${this.globalPrefix}${basePath}${route.path}`;

      router[route.method](fullPath, handler);
    });

    this.app.use(router);
  }

  private createRouteHandler(controllerInstance: any, methodName: string): any {
    const paramsMeta: ParamDefinition[] =
      Reflect.getMetadata(ROUTE_PARAMS, controllerInstance, methodName) || [];
    const classPipes = getPipesMetadata(controllerInstance.constructor) || [];
    const methodPipes = getPipesMetadata(
      controllerInstance.constructor,
      methodName,
    );
    const resolvedPipes = [...classPipes, ...methodPipes].map((pipe) =>
      this.container.resolve(pipe),
    );
    resolvedPipes.push(...this.globalPipes);

    const classGuards = getGuardsMetadata(controllerInstance.constructor);
    const methodGuards = getGuardsMetadata(
      controllerInstance.constructor,
      methodName,
    );
    const reslovedGuards: CanActivate[] = [...classGuards, ...methodGuards].map(
      (guard) => {
        return this.container.resolve(guard);
      },
    );

    const classInterceptors = getInterceptorsMetadata(
      controllerInstance.constructor,
    );
    const methodInterceptors = getInterceptorsMetadata(
      controllerInstance.constructor,
      methodName,
    );
    const resolvedInterceptors = [
      ...classInterceptors,
      ...methodInterceptors,
    ].map((interceptor) => {
      return this.container.resolve(interceptor);
    });
    resolvedInterceptors.push(...this.globalInterceptors);

    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const context = new ExecutionContext(req, res);

        let idx = -1;
        const handler = async () => {
          idx++;
          if (idx < reslovedGuards.length) {
            const canContinue = await reslovedGuards[idx].canActivate(context);
            if (canContinue) {
              return handler();
            }
          }

          const args = await this.extractArguments(req, res, next, paramsMeta);

          if (resolvedPipes.length) {
            for (let i = 0; i < args.length; i++) {
              const paramMeta = paramsMeta.find((p) => p.index === i);
              if (
                !paramMeta ||
                paramMeta.type === 'request' ||
                paramMeta.type === 'response' ||
                paramMeta.type === 'next'
              ) {
                continue;
              }
              const metatype = Reflect.getMetadata(
                'design:paramtypes',
                controllerInstance,
                methodName,
              )[paramMeta.index];

              const metadata: ArgumentMetadata = {
                type: paramMeta.type,
                key: paramMeta.key,
                metatype,
              };

              for (const pipe of resolvedPipes) {
                if (this.isPipeTransform(pipe)) {
                  args[i] = await pipe.transform(args[i], metadata);
                }
              }

              if (paramMeta?.options) {
                args[i] = await this.applyArgOptions(
                  paramMeta,
                  args[i],
                  metadata,
                );
              }
            }
          }
          return controllerInstance[methodName](...args);
        };

        const execute = async () => {
          let idx = -1;
          const intercept = async () => {
            idx++;
            if (idx < resolvedInterceptors.length) {
              return (resolvedInterceptors[idx] as Interceptor).intercept(
                context,
                intercept,
              );
            }
            return handler();
          };
          return intercept();
        };

        const result = await execute();

        const statusCodeMeta = Reflect.getMetadata(
          RES_HTTP_CODE,
          controllerInstance,
          methodName,
        );
        const statusCode = parseInt(`${statusCodeMeta}`) || 200;
        // const headers = Reflect.getMetadata(
        //   RES_HEADER_METHOD,
        //   controllerInstance,
        //   methodName,
        // );
        // console.log('HTTP headers', headers);
        // Handle response
        if (result === undefined || result === null) {
          console.log('result undefined', res.get('status'));
          res.status(204).end();
        } else if (typeof result === 'object') {
          res.status(statusCode).json(result);
        } else {
          res.send(String(result));
        }
      } catch (error) {
        await this.handleException(
          error,
          req,
          res,
          controllerInstance,
          methodName,
        );

        this.defaultErrorHandler(error, req, res);
      }
    };
  }

  private async extractArguments(
    req: Request,
    res: Response,
    next: NextFunction,
    params: ParamDefinition[],
  ) {
    const args: any[] = new Array(params.length).fill(undefined);
    for (const p of params) {
      let value: any;

      switch (p.type) {
        case 'request':
          value = req;
          break;
        case 'response':
          value = res;
          break;
        case 'next':
          value = next;
          break;
        case 'body':
          value = p.key ? req.body[p.key] : req.body;
          break;
        case 'query':
          value = p.key ? req.query[p.key] : req.query;
          break;
        case 'params':
          value = p.key ? req.params[p.key] : req.params;
          break;
        case 'headers':
          value = p.key ? req.headers[p.key.toLowerCase()] : req.headers;
          break;
        case 'cookies':
          value = p.key ? req.cookies?.[p.key] : req.cookies;
          break;
        case 'user':
          value = p.key ? (req as any).user?.[p.key] : (req as any).user;
          break;
      }

      args[p.index] = value;
    }
    return args;
  }

  private async applyArgOptions(p: ParamDefinition, value: any, argType: any) {
    if (typeof p.options === 'object') {
      if (p.options?.required && (value === undefined || value === null)) {
        throw new Error(`Parameter ${p.key} is required`);
      }
      if (p.options?.transform) {
        value = await p.options.transform(value, argType);
      }
    } else if (typeof p.options === 'function') {
      const optionsInstance = this.container.resolve(p.options) as any;
      if (optionsInstance?.transform) {
        value = await optionsInstance.transform(value, argType);
      }
    }
    return value;
  }

  private async handleException(
    error: any,
    req: Request,
    res: Response,
    controllerInstance: any,
    methodName: string,
  ): Promise<void> {
    const classFilters = getFiltersMetadata(controllerInstance.constructor);
    const methodFilters = getFiltersMetadata(
      controllerInstance.constructor,
      methodName,
    );
    const allFilters = [...classFilters, ...methodFilters].map((filter) =>
      this.container.resolve(filter),
    );
    allFilters.push(...this.globalFilters);

    const context = new ExecutionContext(req, res);
    for (const filter of allFilters) {
      try {
        const filterType = (filter as any).constructor;
        const catchType =
          Reflect.getMetadata(FILTERS_CATCH, filterType) || Error;
        if (this.isExceptionFilter(filter) && error instanceof catchType) {
          filter.catch(error, context);
          return;
        }
      } catch (filterError) {
        console.error('Error in exception filter:', filterError);
      }
    }
  }

  private defaultErrorHandler(error: any, req: Request, res: Response): void {
    if (res.headersSent) {
      return;
    }

    const code = error.status || error.statusCode || 500;
    res.status(code as number).json({
      statusCode: code,
      message: error.message || 'Internal server error',
      timestamp: new Date().toISOString(),
      path: req.path,
    });
  }

  private isExceptionFilter(obj: any): obj is ExceptionFilter {
    return obj && typeof obj.catch === 'function';
  }

  private isPipeTransform(obj: any): obj is PipeTransform {
    return obj && typeof obj.transform === 'function';
  }

  serveStatic(path: string, dir: string): this {
    this.app.use(path, express.static(dir));
    return this;
  }

  setViewEngine(engine: string, options?: any): this {
    this.app.set('view engine', engine);
    if (options?.views) {
      this.app.set('views', options.views);
    }
    return this;
  }

  async enableCors(options?: CorsOptions): Promise<this> {
    // const cors = await import('cors');
    this.app.use(cors(options));
    return this;
  }

  enableHealthCheck(path: string = '/health'): this {
    this.app.get(path, (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });
    return this;
  }

  enableErrorCheck(path: string = '/error'): this {
    this.app.get(path, () => {
      let error: any;
      error.trigger();
    });
    return this;
  }

  init() {
    this.loadModule(this.rootModule);

    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        statusCode: 404,
        message: `Cannot ${req.method} ${req.path}`,
        timestamp: new Date().toISOString(),
      });
    });

    this.app.use((err: any, _: any, res: Response, _next: NextFunction) => {
      res.status(500).json({
        status: 'fail',
        message: 'terjadi kegagalan pada server kami',
      });
    });
  }

  listen(port: number, hostname: string, callback?: () => void): void {
    this.init();
    this.app.listen(port, hostname, callback);
  }

  get<T = any>(token: any): T {
    return this.container.resolve<T>(token);
  }

  getHttpServer() {
    return this.app;
  }
}
