import { ApplicationError } from '@main/application/common/errors/application-error';

export class NonExistenceUserLoginError extends ApplicationError {
  constructor(message: string = '') {
    super(message, 'NON_EXISTENCE_USER_LOGIN_ERROR');
    this.name = 'NonExistenceUserLoginError';
  }
}
