import { AuthorizationError } from './authorization-error';
import { ClientError } from './client-error';

describe('AuthorizationError', () => {
  it('should be instance of ClientError', () => {
    const error = new AuthorizationError('');
    expect(error).toBeInstanceOf(ClientError);
  });

  it('should initialize message and have statusCode 403', () => {
    const error = new AuthorizationError('Something error');

    expect(error.name).toBe('AuthorizationError');
    expect(error.message).toBe('Something error');
    expect(error.statusCode).toBe(403);
  });
});
