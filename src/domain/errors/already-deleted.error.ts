import { DomainError } from '../common/domain-error';

export class AlreadyDeletedError extends DomainError {
  constructor(message?: string) {
    super(message, 'ALREADY_DELETED');
    this.name = 'AlreadyDeletedError';
  }
}
