import 'reflect-metadata';
import { AppModule } from './app.module';
import { createHttpApp } from './infrastructure/http/create-http-app';

async function bootstrap() {
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  const host = process.env.HOST ?? 'localhost';

  const app = createHttpApp(AppModule);
  app.listen(port, host, () => {
    console.log(`Server running on port: ${port}`);
  });
}

bootstrap().catch((error) => console.error(error));
