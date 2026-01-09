const FILTERS_CLASS_KEY = Symbol('custom:filters_class');
const FILTERS_METHOD_KEY = Symbol('custom:filters_method');

export function setFiltersMetadata(
  value: any,
  target: any,
  propertyKey?: string | symbol,
) {
  if (!propertyKey) {
    Reflect.defineMetadata(FILTERS_CLASS_KEY, value, target);
  } else {
    Reflect.defineMetadata(FILTERS_METHOD_KEY, value, target, propertyKey);
  }
}

export function getFiltersMetadata(target: any, propertyKey?: string | symbol) {
  if (!propertyKey) {
    return Reflect.getMetadata(FILTERS_CLASS_KEY, target) || [];
  }
  return Reflect.getMetadata(FILTERS_METHOD_KEY, target, propertyKey) || [];
}
