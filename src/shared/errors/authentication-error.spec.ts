import { AuthenticationError } from './authentication-error';
import { ClientError } from './client-error';

describe('AuthenticationError', () => {
  it('should be instance of ClientError', () => {
    const error = new AuthenticationError('');
    expect(error).toBeInstanceOf(ClientError);
  });

  it('should initialize message and have statusCode 401', () => {
    const error = new AuthenticationError('Something error');

    expect(error.name).toBe('AuthenticationError');
    expect(error.message).toBe('Something error');
    expect(error.statusCode).toBe(401);
  });
});
