import { DomainError } from '../../../domain/common/domain-error';

export class RefreshTokenNotFoundError extends DomainError {
  constructor() {
    super('Cannot find refresh token', 'REFRESH_TOKEN_NOT_FOUND');
    this.name = 'RefreshTokenNotFoundError';
  }
}
