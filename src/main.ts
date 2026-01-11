import 'reflect-metadata';
// import expressListRoutes from 'express-list-routes';
import { AppModule } from './app.module';
import { MyExpressApp } from './libs/my-app/core/my-express-app';
import { WrapResponseInterceptor } from './infrastructure/interceptors/wrap-response.interceptor';
import { ClientErrorFilter } from './infrastructure/filters/client-error.filter';
import { LoggingInterceptor } from './infrastructure/interceptors/logging.interceptor';
import { JoiValidationPipe } from './presentation/shared/pipes/joi-validation.pipe';
import { ApplicationErrorFilter } from './infrastructure/filters/application-error.filter';

async function bootstrap() {
  const app = new MyExpressApp(AppModule);
  app
    .useGlobalPipes(JoiValidationPipe)
    .useGlobalInterceptors(WrapResponseInterceptor, LoggingInterceptor)
    .useGlobalFilters(ApplicationErrorFilter, ClientErrorFilter);

  app.listen(
    process.env.PORT ? parseInt(process.env.PORT) : 3000,
    process.env.HOST ?? 'localhost',
    () => {
      console.log('Server running on port');
    },
  );
  // console.log('express routes', expressListRoutes(app.getApp()));
}

bootstrap().catch((error) => console.error(error));
