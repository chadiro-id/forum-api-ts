import { ClientError } from './client-error';
import { InvariantError } from './invariant-error';

describe('InvariantError', () => {
  it('should be instance of ClientError', () => {
    const error = new InvariantError('');
    expect(error).toBeInstanceOf(ClientError);
  });

  it('should initialize message and have statusCode 400', () => {
    const error = new InvariantError('Something error');

    expect(error.name).toBe('InvariantError');
    expect(error.message).toBe('Something error');
    expect(error.statusCode).toBe(400);
  });
});
