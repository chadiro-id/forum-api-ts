import { ApplicationError } from '@main/application/common/errors/application-error';
import { RefreshTokenNotExistsError } from './refresh-token-not-exists.error';

describe('RefreshTokenNotExistsError', () => {
  it('should be instance of ApplicationError', () => {
    const error = new RefreshTokenNotExistsError();
    expect(error).toBeInstanceOf(ApplicationError);
  });

  it('should correctly initialize properties', () => {
    const error = new RefreshTokenNotExistsError();

    expect(error.name).toBe('RefreshTokenNotExistsError');
    expect(error.message).toBe('refresh token not exists');
    expect(error.code).toBe('NON_EXISTENCE_ERROR');
  });
});
