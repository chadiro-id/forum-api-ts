import { ApplicationError } from '@main/application/common/errors/application-error';

export class CommentDeceptiveAccessError extends ApplicationError {
  constructor(message?: string) {
    super(message || 'Cannot access comment', 'DECEPTIVE_ACCESS_ERROR');
    this.name = 'CommentDeceptiveAccessError';
  }
}
