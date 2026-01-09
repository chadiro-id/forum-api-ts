import { DomainError } from '../../../domain/common/domain-error';

export class CommentNotFoundError extends DomainError {
  constructor(id?: string) {
    const message = id
      ? `Cannot find comment with id "${id}"`
      : 'Cannot find comment';

    super(message, 'COMMENT_NOT_FOUND');
    this.name = 'CommentNotFoundError';
  }
}
