import { DomainError } from '../../../domain/common/domain-error';

export class ReplyForbiddenAccessError extends DomainError {
  constructor(message?: string) {
    super(message, 'FORBIDDEN_ACCESS');
    this.name = 'ReplyForbiddenAccessError';
  }
}
