import { ApplicationError } from '../../common/errors/application-error';

export class InvalidCredentialsError extends ApplicationError {
  constructor(message: string = '') {
    super(message, 'AUTHENTICATION_ERROR');
    this.name = 'InvalidCredentialsError';
  }
}
