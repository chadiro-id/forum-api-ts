import * as dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import 'reflect-metadata';

if (existsSync('.env.test')) {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

process.env.TZ = 'UTC';

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
});
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});
