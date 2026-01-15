import { JoiValidationPipe } from '../../presentation/shared/pipes/joi-validation.pipe';
import { MyExpressApp } from '../../libs/my-app/core/my-express-app';
import { ClientErrorFilter } from '../filters/client-error.filter';
import { WrapResponseInterceptor } from '../interceptors/wrap-response.interceptor';
import { ApplicationErrorFilter } from '../filters/application-error.filter';

export type CreateHttpAppOptions = {
  enableError?: boolean;
  enableHelloWorld?: boolean;
};

export function createHttpApp(module: any, options?: CreateHttpAppOptions) {
  const app = new MyExpressApp(module);
  app.useGlobalFilters(ApplicationErrorFilter, ClientErrorFilter);
  app.useGlobalPipes(JoiValidationPipe);
  app.useGlobalInterceptors(WrapResponseInterceptor);

  if (options?.enableHelloWorld) {
    app.enableHelloWorld();
  }

  if (options?.enableError) {
    app.enableErrorCheck();
  }

  return app;
}
