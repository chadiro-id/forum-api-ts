import { ArgumentMetadata } from '../../../libs/my-app/common/controllers/controllers.type';
import { PipeTransform } from '../../../libs/my-app/common/pipes/pipe-transform';

export class IdConverter implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const id = new metadata.metatype(value);
    return id;
  }
}
