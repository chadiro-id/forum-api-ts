import { ApplicationError } from '../../common/errors/application-error';

export class ReplyUnauthorizedAccessError extends ApplicationError {
  constructor(message: string) {
    super(message, 'UNAUTHORIZED_ACCESS_ERROR');
    this.name = 'ReplyUnauthorizedAccessError';
  }
}
