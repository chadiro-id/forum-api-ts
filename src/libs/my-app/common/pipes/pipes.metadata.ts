/* eslint-disable @typescript-eslint/no-unsafe-argument */
const PIPES_CLASS_KEY = Symbol('custom:pipes_class');
const PIPES_METHOD_KEY = Symbol('custom:pipes_method');

export function setPipesMetadata(
  value: any,
  target: any,
  propertyKey?: string | symbol,
) {
  if (!propertyKey) {
    Reflect.defineMetadata(PIPES_CLASS_KEY, value, target);
  } else {
    Reflect.defineMetadata(PIPES_METHOD_KEY, value, target, propertyKey);
  }
}

export function getPipesMetadata(target: any, propertyKey?: string | symbol) {
  if (!propertyKey) {
    return Reflect.getMetadata(PIPES_CLASS_KEY, target) || [];
  }
  return Reflect.getMetadata(PIPES_METHOD_KEY, target, propertyKey) || [];
}
