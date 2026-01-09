import { setInterceptorsMetadata } from './interceptors.metadata';

export function UseInterceptors(
  ...interceptors: any[]
): ClassDecorator & MethodDecorator {
  return (target: any, propertyKey?: string | symbol) => {
    if (propertyKey) {
      setInterceptorsMetadata(interceptors, target.constructor, propertyKey);
    } else {
      setInterceptorsMetadata(interceptors, target);
    }
  };
}
