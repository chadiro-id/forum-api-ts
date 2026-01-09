import { ExecutionContext } from '../../libs/my-app/core/http/execution-context';
import { Injectable } from '../../libs/my-app/common/injections/injections.decorator';
import { Interceptor } from '../../libs/my-app/common/interceptors/interceptor';

@Injectable()
export class LoggingInterceptor implements Interceptor {
  async intercept(
    context: ExecutionContext,
    next: () => Promise<any>,
  ): Promise<any> {
    const start = Date.now();

    const result = await next();

    console.log(`Request took ${Date.now() - start}ms`);
    console.log('context', context.getRequest().path);

    return result;
  }
}
