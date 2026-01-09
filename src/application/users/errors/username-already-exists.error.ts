import { DomainError } from '../../../domain/common/domain-error';

export class UsernameAlreadyExistsError extends DomainError {
  constructor(username?: string) {
    const message = username
      ? `Username "${username}" already exists`
      : 'Username already exists';

    super(message, 'USERNAME_ALREADY_EXISTS');
    this.name = 'UsernameAlreadyExistsError';
  }
}
