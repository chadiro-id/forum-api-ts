import { ApplicationError } from '../../common/errors/application-error';

export class ReplyDeceptiveAccessError extends ApplicationError {
  constructor(message: string = '') {
    super(message, 'DECEPTIVE_ACCESS_ERROR');
    this.name = 'ReplyDeceptiveAccessError';
  }
}
