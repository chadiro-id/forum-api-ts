/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { ModuleOptions } from './modules.type';

export function Module(options: ModuleOptions): ClassDecorator {
  return (target) => {
    options.imports = options.imports || [];
    options.providers = options.providers || [];
    options.controllers = options.controllers || [];
    Reflect.defineMetadata('custom:di:module', options, target);
  };
}

export function getModuleMetadata(target: any) {
  const defaultOptions: ModuleOptions = {
    imports: [],
    providers: [],
    controllers: [],
  };
  return Reflect.getMetadata('custom:di:module', target) || defaultOptions;
}

export function Global(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata('custom:di:module:global', true, target);
  };
}

export function getGlobalModuleMetadata(target: any) {
  return Reflect.getMetadata('custom:di:module:global', target) || false;
}
