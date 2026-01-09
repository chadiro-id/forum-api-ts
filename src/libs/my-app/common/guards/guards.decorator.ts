import { PUBLIC_CLASS, PUBLIC_METHOD } from '../../constant/metadata.constant';
import { setGuardsMetadata } from './guards.metadata';

export function UseGuards(...guards: any[]): ClassDecorator & MethodDecorator {
  return (target: any, propertyKey?: string | symbol) => {
    if (propertyKey) {
      setGuardsMetadata(guards, target.constructor, propertyKey);
    } else {
      setGuardsMetadata(guards, target);
    }
  };
}

export function Public(): ClassDecorator & MethodDecorator {
  return (target: any, propertyKey?: string | symbol) => {
    if (propertyKey) {
      Reflect.defineMetadata(
        PUBLIC_METHOD,
        true,
        target.constructor,
        propertyKey,
      );
    } else {
      Reflect.defineMetadata(PUBLIC_CLASS, true, target);
    }
  };
}
