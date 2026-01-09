import { Config } from 'jest';
import defaultConfig from './jest.config';

const config: Config = {
  ...defaultConfig,
  testMatch: ['**/*.it.test.ts'],
};

export default config;
