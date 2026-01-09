import { DomainError } from '../common/domain-error';

export class DeceptiveAccessError extends DomainError {
  constructor(message?: string, code?: string) {
    super(message, code);
    this.name = 'DeceptiveAccessError';
  }
}
