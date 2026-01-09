export type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'options'
  | 'head';

export type ParamDecoratorType =
  | 'params'
  | 'query'
  | 'body'
  | 'headers'
  | 'cookies'
  | 'request'
  | 'response'
  | 'next'
  | 'user';

export interface RouteDefinition {
  path: string;
  method: HttpMethod;
  methodName: string;
  params: ParamDefinition[];
}

export interface ParamDefinition {
  index: number;
  type: ParamDecoratorType;
  key?: string;
  options?: ParamOptions | (new (...args: any[]) => any);
}

export interface ParamOptions {
  required?: boolean;
  isFile: boolean;
  multiple: boolean;
  transform?: (value: any, argType?: any) => any;
  validate?: (value: any) => boolean | Promise<boolean>;
}

export interface ArgumentMetadata {
  type: ParamDecoratorType;
  key?: string;
  metatype?: any;
}
