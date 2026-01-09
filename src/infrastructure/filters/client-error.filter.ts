import { ExecutionContext } from '../../libs/my-app/core/http/execution-context';
import { ExceptionFilter } from '../../libs/my-app/common/filters/exception-filter';
import { Catch } from '../../libs/my-app/common/filters/filters.decorator';
import { ClientError } from '../../shared/errors/client-error';

@Catch(ClientError)
export class ClientErrorFilter implements ExceptionFilter {
  catch(exception: ClientError, context: ExecutionContext) {
    const res = context.getResponse();
    res.status(exception.statusCode).json({
      status: 'fail',
      message: exception.message,
    });
  }
}
