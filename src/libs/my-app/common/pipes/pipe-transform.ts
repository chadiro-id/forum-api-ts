import { ArgumentMetadata } from '../controllers/controllers.type';

export interface PipeTransform<T = any, R = any> {
  transform(value: T, metadata: ArgumentMetadata): R;
}
