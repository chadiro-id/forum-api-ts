import { ApplicationError } from '@main/application/common/errors/application-error';

export class RefreshTokenNotFoundError extends ApplicationError {
  constructor() {
    super('Cannot find refresh token', 'KEY_NOT_FOUND_ERROR');
    this.name = 'RefreshTokenNotFoundError';
  }
}
