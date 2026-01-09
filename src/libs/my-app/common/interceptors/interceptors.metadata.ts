const INTERCEPTORS_CLASS_KEY = Symbol('custom:interceptors_class');
const INTERCEPTORS_METHOD_KEY = Symbol('custom:interceptors_method');

export function setInterceptorsMetadata(
  value: any,
  target: any,
  propertyKey?: string | symbol,
) {
  if (!propertyKey) {
    Reflect.defineMetadata(INTERCEPTORS_CLASS_KEY, value, target);
  } else {
    Reflect.defineMetadata(INTERCEPTORS_METHOD_KEY, value, target, propertyKey);
  }
}

export function getInterceptorsMetadata(
  target: any,
  propertyKey?: string | symbol,
) {
  if (!propertyKey) {
    return Reflect.getMetadata(INTERCEPTORS_CLASS_KEY, target) || [];
  }
  return (
    Reflect.getMetadata(INTERCEPTORS_METHOD_KEY, target, propertyKey) || []
  );
}
