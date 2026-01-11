import { ApplicationError } from '../../common/errors/application-error';
import { InvalidCredentialsError } from './invalid-credentials.error';

describe('InvalidCredentialsError', () => {
  it('should be instance of ApplicationError', () => {
    const error = new InvalidCredentialsError();
    expect(error).toBeInstanceOf(ApplicationError);
  });

  it('should correctly initialize properties', () => {
    const error = new InvalidCredentialsError('Error message');

    expect(error.name).toBe('InvalidCredentialsError');
    expect(error.message).toBe('Error message');
    expect(error.code).toBe('INVALID_LOGIN_CREDENTIALS_ERROR');
  });
});
