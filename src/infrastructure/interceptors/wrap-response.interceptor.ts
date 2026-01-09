import { ExecutionContext } from '../../libs/my-app/core/http/execution-context';
import { Injectable } from '../../libs/my-app/common/injections/injections.decorator';
import { Interceptor } from '../../libs/my-app/common/interceptors/interceptor';

@Injectable()
export class WrapResponseInterceptor implements Interceptor {
  async intercept(_: ExecutionContext, next: () => any) {
    const data = await next();

    return {
      status: 'success',
      data,
    };
  }
}
