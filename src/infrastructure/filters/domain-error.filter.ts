import { Response } from 'express';
import { ExceptionFilter } from '../../libs/my-app/common/filters/exception-filter';
import { DomainError } from '../../domain/common/domain-error';
import { ExecutionContext } from '../../libs/my-app/core/http/execution-context';
import { Catch } from '../../libs/my-app/common/filters/filters.decorator';
import domainErrorTranslator from './domain-error-translator';
import { ClientError } from '../../shared/errors/client-error';

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(exception: DomainError, context: ExecutionContext) {
    const translatedError = domainErrorTranslator.translate(exception);

    const res = context.getResponse<Response>();
    if (translatedError instanceof ClientError) {
      res.status(translatedError.statusCode).json({
        status: 'fail',
        message: translatedError.message,
      });
    }
  }
}
