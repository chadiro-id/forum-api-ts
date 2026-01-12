import { ApplicationError } from '../../common/errors/application-error';
import { ThreadNotFoundError } from './thread-not-found.error';

describe('ThreadNotFoundError', () => {
  it('should be instance of ApplicationError', () => {
    const error = new ThreadNotFoundError();
    expect(error).toBeInstanceOf(ApplicationError);
  });

  it('should correctly initialize properties', () => {
    const error = new ThreadNotFoundError();

    expect(error.name).toBe('ThreadNotFoundError');
    expect(error.message).toBe('Cannot find thread');
    expect(error.code).toBe('KEY_NOT_FOUND_ERROR');
  });

  it('should have correct message with the given thread id', () => {
    const error = new ThreadNotFoundError('thread-123');
    expect(error.message).toBe('Cannot find thread with id "thread-123"');
  });
});
