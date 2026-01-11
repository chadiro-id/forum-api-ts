import { ApplicationError } from '@main/application/common/errors/application-error';

export class RefreshTokenNotFoundError extends ApplicationError {
  constructor(message?: string) {
    super(message || 'token not exists', 'NON_EXISTENCE_ERROR');
    this.name = 'RefreshTokenNotFoundError';
  }
}
