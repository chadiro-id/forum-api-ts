import { ApplicationError } from '@main/application/common/errors/application-error';

export class RefreshTokenNotFoundError extends ApplicationError {
  constructor() {
    super('token not exists', 'NON_EXISTENCE_ERROR');
    this.name = 'RefreshTokenNotFoundError';
  }
}
