import { DomainError } from '../../../domain/common/domain-error';
import { RefreshTokenNotFoundError } from './refresh-token-not-found.error';

describe('RefreshTokenNotFoundError', () => {
  it('should be instance of DomainError', () => {
    const error = new RefreshTokenNotFoundError();
    expect(error).toBeInstanceOf(DomainError);
  });

  it('should correctly initialize properties', () => {
    const error = new RefreshTokenNotFoundError();

    expect(error.name).toBe('RefreshTokenNotFoundError');
    expect(error.message).toBe('Cannot find refresh token');
    expect(error.code).toBe('REFRESH_TOKEN_NOT_FOUND');
  });
});
