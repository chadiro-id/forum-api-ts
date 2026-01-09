import * as dotenv from 'dotenv';
dotenv.config();
import { Inject } from '../../libs/my-app/common/injections/injections.decorator';

export interface ConfigServiceOptions {
  load: Array<{
    key: string;
    value: any;
    joiSchema?: any;
  }>;
}

export class ConfigService {
  private config: Record<string, any> = {};

  constructor(@Inject('CONFIG_OPTIONS') options: ConfigServiceOptions) {
    for (const loadOpt of options.load) {
      this.config[loadOpt.key] = this.load(loadOpt.value, loadOpt.joiSchema);
    }
  }

  get<T = any>(key: string) {
    return this.config[key] as T;
  }

  private load(configValue: any, schema?: any) {
    if (!schema) return configValue;

    const { error, value } = schema.validate(configValue);
    if (error) {
      throw new Error(`Failed to load database config: ${error.message}`);
    }
    return value;
  }
}
