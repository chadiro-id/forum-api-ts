/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { setPipesMetadata } from './pipes.metadata';

export function UsePipes(...pipes: any[]): ClassDecorator & MethodDecorator {
  return (target: any, propertyKey?: string | symbol) => {
    if (propertyKey) {
      setPipesMetadata(pipes, target.constructor, propertyKey);
    } else {
      setPipesMetadata(pipes, target);
    }
  };
}

export function Transform(...args: any[]): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata('custom:pipes:transform', args, target);
  };
}
