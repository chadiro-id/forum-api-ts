import { AppModule } from '@main/app.module';
import { createHttpApp } from '@main/infrastructure/http/create-http-app';
import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';

export interface ServerTest {
  init: () => void;
  request: () => TestAgent;
  getResolvedInstance: <T = any>(arg: any) => T;
}

export const createServerTest = () => {
  const app = createHttpApp(AppModule, {
    enableError: true,
    enableHelloWorld: true,
  });

  return {
    init: () => {
      app.init();
    },
    request: () => {
      return supertest(app.getHttpServer());
    },
    getResolvedInstance: <T = any>(token: any) => app.get<T>(token),
  } as ServerTest;
};
