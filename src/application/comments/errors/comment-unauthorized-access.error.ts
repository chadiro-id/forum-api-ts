import { ApplicationError } from '@main/application/common/errors/application-error';

export class CommentUnauthorizedAccessError extends ApplicationError {
  constructor(message?: string) {
    super(message || 'Unauthorized', 'UNAUTHORIZED_ACCESS_ERROR');
    this.name = 'CommentUnauthorizedAccessError';
  }
}
