/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { normalizePath } from './controllers.util';
import {
  HttpMethod,
  RouteDefinition,
  ParamDecoratorType,
  ParamDefinition,
} from './controllers.type';
import {
  CONTROLLER,
  RES_HEADER_CLASS,
  RES_HEADER_METHOD,
  RES_HTTP_CODE,
  ROUTE,
  ROUTE_PARAMS,
} from '../../constant/metadata.constant';

export function Controller(path: string = ''): ClassDecorator {
  return (target: any) => {
    const metadataValue = normalizePath(path);

    Reflect.defineMetadata(CONTROLLER, metadataValue, target);
  };
}

function createRouteDecorator(method: HttpMethod) {
  return (path: string = ''): MethodDecorator => {
    return (target: any, propertyKey: string | symbol) => {
      const routePath = normalizePath(path);

      const routeMetadata: RouteDefinition = {
        path: routePath,
        method,
        methodName: propertyKey as string,
        params: [],
      };

      const routes = Reflect.getMetadata(ROUTE, target.constructor) || [];
      routes.push(routeMetadata);

      Reflect.defineMetadata(ROUTE, routes, target.constructor);
    };
  };
}

function createRouteParamDecorator(type: ParamDecoratorType) {
  return (key?: string, options?: any): ParameterDecorator => {
    return (
      target: any,
      propertyKey: string | symbol | undefined,
      parameterIndex: number,
    ) => {
      if (!propertyKey) return;

      const paramMetadata: ParamDefinition = {
        index: parameterIndex,
        type,
        key,
        options,
      };

      const existingParams: ParamDefinition[] =
        Reflect.getMetadata(ROUTE_PARAMS, target, propertyKey) || [];

      existingParams.push(paramMetadata);
      Reflect.defineMetadata(ROUTE_PARAMS, existingParams, target, propertyKey);
    };
  };
}

export const Get = createRouteDecorator('get');
export const Post = createRouteDecorator('post');
export const Put = createRouteDecorator('put');
export const Delete = createRouteDecorator('delete');
export const Patch = createRouteDecorator('patch');

export const Request = () => createRouteParamDecorator('request')();
export const Req = Request;
export const Response = () => createRouteParamDecorator('response')();
export const Res = Response;
export const Next = () => createRouteParamDecorator('next')();
export const Body = (key?: string, options?: any) =>
  createRouteParamDecorator('body')(key, options);
export const Query = (key?: string, options?: any) =>
  createRouteParamDecorator('query')(key, options);
export const Param = (key?: string, options?: any) =>
  createRouteParamDecorator('params')(key, options);
export const Headers = (key?: string, options?: any) =>
  createRouteParamDecorator('headers')(key, options);
export const Cookies = (key?: string, options?: any) =>
  createRouteParamDecorator('cookies')(key, options);
export const User = (key?: string, options?: any) =>
  createRouteParamDecorator('user')(key, options);

export function HttpCode(statusCode: number): MethodDecorator {
  return (target: any, propertyKey: string | symbol) => {
    Reflect.defineMetadata(RES_HTTP_CODE, statusCode, target, propertyKey);
  };
}

export function Header(
  value: Record<string, string>,
): ClassDecorator & MethodDecorator {
  return (target: any, propertyKey?: string | symbol) => {
    if (propertyKey) {
      const existing = Reflect.getMetadata(
        RES_HEADER_METHOD,
        target,
        propertyKey,
      );
      const metadataValue = { ...existing, ...value };
      Reflect.defineMetadata(
        RES_HEADER_METHOD,
        metadataValue,
        target,
        propertyKey,
      );
    } else {
      const existingValue = Reflect.getMetadata(RES_HEADER_CLASS, target);
      const metadataValue = { ...existingValue, ...value };
      Reflect.defineMetadata(RES_HEADER_CLASS, metadataValue, target);
    }
  };
}
