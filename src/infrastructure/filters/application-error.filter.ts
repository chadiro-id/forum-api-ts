import { ExecutionContext } from '../../libs/my-app/core/http/execution-context';
import { ExceptionFilter } from '../../libs/my-app/common/filters/exception-filter';
import { Catch } from '../../libs/my-app/common/filters/filters.decorator';
import { ApplicationError } from '../../application/common/errors/application-error';

@Catch(ApplicationError)
export class ApplicationErrorFilter implements ExceptionFilter {
  catch(exception: ApplicationError, context: ExecutionContext) {
    console.log('[ApplicationErrorFilter]', exception);

    let statusCode: number | undefined;
    switch (exception.code) {
      case 'INVALID_LOGIN_CREDENTIALS_ERROR':
        statusCode = 401;
        break;
      case 'UNAUTHORIZED_ACCESS_ERROR':
        statusCode = 403;
        break;
      case 'KEY_NOT_FOUND_ERROR':
        statusCode = 404;
        break;
      case 'INVALID_OPERATIONS_ERROR':
        statusCode = 409;
        break;
      case 'NON_EXISTENCE_USER_LOGIN_ERROR':
      case 'USERNAME_ALREADY_EXISTS_ERROR':
      case 'DECEPTIVE_ACCESS_ERROR':
        statusCode = 400;
        break;
    }

    if (statusCode) {
      const response = context.getResponse();
      response.status(statusCode).json({
        status: 'fail',
        message: exception.message,
      });
    }
  }
}
