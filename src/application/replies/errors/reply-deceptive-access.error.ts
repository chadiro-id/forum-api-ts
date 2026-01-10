import { DomainError } from '../../../domain/common/domain-error';

export class ReplyDeceptiveAccessError extends DomainError {
  constructor(message?: string) {
    super(message, 'DECEPTIVE_ACCESS');
    this.name = 'ReplyDeceptiveAccessError';
  }
}
