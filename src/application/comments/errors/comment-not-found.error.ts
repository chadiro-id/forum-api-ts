import { ApplicationError } from '@main/application/common/errors/application-error';

export class CommentNotFoundError extends ApplicationError {
  constructor(id?: string) {
    const message = id
      ? `Cannot find comment with id "${id}"`
      : 'Cannot find comment';

    super(message, 'KEY_NOT_FOUND_ERROR');
    this.name = 'CommentNotFoundError';
  }
}
