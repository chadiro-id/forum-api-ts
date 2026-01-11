import { ApplicationError } from '../../common/errors/application-error';

export class RefreshTokenNotExistsError extends ApplicationError {
  constructor(message?: string) {
    super(message || 'refresh token not exists', 'NON_EXISTENCE_ERROR');
    this.name = 'RefreshTokenNotExistsError';
  }
}
