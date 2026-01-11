import { ApplicationError } from '../../common/errors/application-error';

export class UsernameAlreadyExistsError extends ApplicationError {
  constructor(username?: string) {
    const message = username
      ? `Username "${username}" already exists`
      : 'Username already exists';

    super(message, 'INVALID_OPERATION_ERROR');
    this.name = 'UsernameAlreadyExistsError';
  }
}
