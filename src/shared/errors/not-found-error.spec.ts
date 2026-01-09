import { ClientError } from './client-error';
import { NotFoundError } from './not-found-error';

describe('NotFoundError', () => {
  it('should be instance of ClientError', () => {
    const error = new NotFoundError('');
    expect(error).toBeInstanceOf(ClientError);
  });

  it('should initialize message and have statusCode 404', () => {
    const error = new NotFoundError('Not found');

    expect(error.name).toBe('NotFoundError');
    expect(error.message).toBe('Not found');
    expect(error.statusCode).toBe(404);
  });
});
