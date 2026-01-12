import { ExecutionContext } from '../../libs/my-app/core/http/execution-context';
import { ExceptionFilter } from '../../libs/my-app/common/filters/exception-filter';
import { Catch } from '../../libs/my-app/common/filters/filters.decorator';
import { ApplicationError } from '../../application/common/errors/application-error';
import { InvalidCredentialsError } from '../../application/authentications/errors/invalid-credentials.error';
import { UsernameAlreadyExistsError } from '../../application/users/errors/username-already-exists.error';
import { NonExistenceUserLoginError } from '../../application/authentications/errors/non-existence-user-login.error';
import { RefreshTokenNotExistsError } from '../../application/authentications/errors/refresh-token-not-exists.error';
import { ThreadNotFoundError } from '../../application/threads/errors/thread-not-found.error';
import { CommentNotFoundError } from '../../application/comments/errors/comment-not-found.error';
import { CommentDeceptiveAccessError } from '../../application/comments/errors/comment-deceptive-access.error';
import { CommentUnauthorizedAccessError } from '../../application/comments/errors/comment-unauthorized-access.error';
import { ReplyNotFoundError } from '../../application/replies/errors/reply-not-found.error';
import { ReplyDeceptiveAccessError } from '../../application/replies/errors/reply-deceptive-access.error';
import { ReplyUnauthorizedAccessError } from '../../application/replies/errors/reply-unauthorized-access.error';

@Catch(ApplicationError)
export class ApplicationErrorFilter implements ExceptionFilter {
  catch(exception: ApplicationError, context: ExecutionContext) {
    console.log('[ApplicationErrorFilter]', exception);

    let statusCode: number | undefined;
    let message: string | undefined;
    switch (exception.name) {
      case UsernameAlreadyExistsError.name:
        statusCode = 400;
        message = 'username tidak tersedia';
        break;
      case InvalidCredentialsError.name:
        statusCode = 401;
        message = 'kredensial yang anda masukkan salah';
        break;
      case NonExistenceUserLoginError.name:
        statusCode = 400;
        message = 'pengguna tidak ada';
        break;
      case RefreshTokenNotExistsError.name:
        statusCode = 400;
        message = 'refresh token tidak ditemukan di database';
        break;
      case ThreadNotFoundError.name:
        statusCode = 404;
        message = 'thread tidak ditemukan';
        break;
      case CommentNotFoundError.name:
        statusCode = 404;
        message = 'komentar tidak ditemukan';
        break;
      case CommentDeceptiveAccessError.name:
        statusCode = 400;
        message = 'tidak dapat mengakses komentar';
        break;
      case CommentUnauthorizedAccessError.name:
        statusCode = 403;
        message = 'pengguna tidak memiliki hak akses';
        break;
      case ReplyNotFoundError.name:
        statusCode = 404;
        message = 'balasan tidak ditemukan';
        break;
      case ReplyDeceptiveAccessError.name:
        statusCode = 400;
        message = 'tidak dapat mengakses balasan';
        break;
      case ReplyUnauthorizedAccessError.name:
        statusCode = 403;
        message = 'pengguna tidak memiliki hak akses';
        break;
    }

    if (statusCode) {
      const response = context.getResponse();
      response.status(statusCode).json({
        status: 'fail',
        message,
      });
    }
  }
}
