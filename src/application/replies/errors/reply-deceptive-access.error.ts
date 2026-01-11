import { ApplicationError } from '../../common/errors/application-error';

export class ReplyDeceptiveAccessError extends ApplicationError {
  constructor(message?: string) {
    super(message || 'Cannot access reply', 'DECEPTIVE_ACCESS_ERROR');
    this.name = 'ReplyDeceptiveAccessError';
  }
}
