import { DomainError } from '../../../domain/common/domain-error';

export class NonExistenceUserLoginError extends DomainError {
  constructor(message?: string) {
    super(message, 'NON_EXISTENCE_USER_LOGIN');
    this.name = 'NonExistenceUserLoginError';
  }
}
