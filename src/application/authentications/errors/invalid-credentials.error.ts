import { DomainError } from '../../../domain/common/domain-error';

export class InvalidCredentialsError extends DomainError {
  constructor(message?: string) {
    super(message, 'INVALID_CREDENTIALS');
    this.name = 'InvalidCredentialsError';
  }
}
