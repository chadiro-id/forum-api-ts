import { FILTERS_CATCH } from '../../constant/metadata.constant';
import { setFiltersMetadata } from './filters.metadata';

export function UseFilters(
  ...filters: any[]
): ClassDecorator & MethodDecorator {
  return (target: any, propertyKey?: string | symbol) => {
    if (propertyKey) {
      setFiltersMetadata(filters, target.constructor, propertyKey);
    } else {
      setFiltersMetadata(filters, target);
    }
  };
}

export function Catch(arg: any): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata(FILTERS_CATCH, arg, target);
  };
}
