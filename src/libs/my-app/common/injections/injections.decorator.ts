import { ProviderScope } from '../../core/di/types';

export const DI_INJECTABLE_KEY = Symbol('custom:di:injectable');
export const DI_INJECT_KEY = Symbol('custom:di:inject');

export function Injectable(options?: {
  scope?: ProviderScope;
}): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(
      DI_INJECTABLE_KEY,
      options?.scope || 'SINGLETON',
      target,
    );
  };
}

export function Inject(token: any): ParameterDecorator {
  return (target, _, index) => {
    const existing = Reflect.getMetadata(DI_INJECT_KEY, target) || [];
    existing[index!] = token;
    Reflect.defineMetadata(DI_INJECT_KEY, existing, target);
  };
}
