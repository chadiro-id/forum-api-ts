const GUARDS_CLASS_KEY = Symbol('custom:guards_class');
const GUARDS_METHOD_KEY = Symbol('custom:guards_method');

export function setGuardsMetadata(
  value: any,
  target: any,
  propertyKey?: string | symbol,
) {
  if (!propertyKey) {
    Reflect.defineMetadata(GUARDS_CLASS_KEY, value, target);
  } else {
    Reflect.defineMetadata(GUARDS_METHOD_KEY, value, target, propertyKey);
  }
}

export function getGuardsMetadata(target: any, propertyKey?: string | symbol) {
  if (!propertyKey) {
    return Reflect.getMetadata(GUARDS_CLASS_KEY, target) || [];
  }
  return Reflect.getMetadata(GUARDS_METHOD_KEY, target, propertyKey) || [];
}
