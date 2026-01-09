import { ArgumentMetadata } from '../controllers/controllers.type';
import { PipeTransform } from './pipe-transform';

export class ValidationPipe implements PipeTransform {
  constructor(private schema?: any) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new Error(`Validation failed: ${metadata.key} is empty`);
    }

    if (this.schema) {
      const { error } = this.schema.validate(value);
      if (error) {
        throw new Error(`Validation failed: ${error.message}`);
      }
    }

    return value;
  }
}

export class ParseIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined || value === null) {
      throw new Error(`Parameter ${metadata.key} is required`);
    }

    const parsed = parseInt(value as string, 10);
    if (isNaN(parsed)) {
      throw new Error(`Parameter ${metadata.key} must be a number`);
    }

    return parsed;
  }
}

export class ParseBoolPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined || value === null) {
      return false;
    }

    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      if (value.toLowerCase() === 'true') return true;
      if (value.toLowerCase() === 'false') return false;
    }

    throw new Error(`Parameter ${metadata.key} must be a boolean`);
  }
}

export class DefaultValuePipe implements PipeTransform {
  constructor(private defaultValue: any) {}

  transform(value: any) {
    if (value === undefined || value === null) {
      return this.defaultValue;
    }
    return value;
  }
}
