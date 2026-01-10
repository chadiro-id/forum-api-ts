import { DomainError } from '../../../domain/common/domain-error';

export class CommentDeceptiveAccessError extends DomainError {
  constructor(message?: string) {
    super(message || 'Cannot access comment', 'DECEPTIVE_ACCESS');
    this.name = 'CommentDeceptiveAccessError';
  }
}
