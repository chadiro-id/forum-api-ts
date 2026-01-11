import { ApplicationError } from '../../common/errors/application-error';

export class InvalidCredentialsError extends ApplicationError {
  constructor(message: string = '') {
    super(message, 'INVALID_LOGIN_CREDENTIALS_ERROR');
    this.name = 'InvalidCredentialsError';
  }
}
