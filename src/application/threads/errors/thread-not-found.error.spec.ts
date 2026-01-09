import { DomainError } from '../../../domain/common/domain-error';
import { ThreadNotFoundError } from './thread-not-found.error';

describe('ThreadNotFoundError', () => {
  it('should be instance of DomainError', () => {
    const error = new ThreadNotFoundError();
    expect(error).toBeInstanceOf(DomainError);
  });

  it('should correctly initialize properties', () => {
    const error = new ThreadNotFoundError();

    expect(error.name).toBe('ThreadNotFoundError');
    expect(error.message).toBe('Cannot find thread');
    expect(error.code).toBe('THREAD_NOT_FOUND');
  });

  it('should have correct message with the given thread id', () => {
    const error = new ThreadNotFoundError('thread-123');
    expect(error.message).toBe('Cannot find thread with id "thread-123"');
  });
});
