import { ApplicationError } from '../../common/errors/application-error';

export class ReplyNotFoundError extends ApplicationError {
  constructor(id?: string) {
    const message = id
      ? `Cannot find reply with id "${id}"`
      : 'Cannot find reply';

    super(message, 'KEY_NOT_FOUND_ERROR');
    this.name = 'ReplyNotFoundError';
  }
}
