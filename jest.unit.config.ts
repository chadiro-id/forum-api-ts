import { Config } from 'jest';
import defaultConfig from './jest.config';

const config: Config = {
  ...defaultConfig,
  testMatch: ['**/*.spec.ts'],
};

export default config;
