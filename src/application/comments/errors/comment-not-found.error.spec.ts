import { DomainError } from '../../../domain/common/domain-error';
import { CommentNotFoundError } from './comment-not-found.error';

describe('CommentNotFoundError', () => {
  it('should be instance of DomainError', () => {
    const error = new CommentNotFoundError();
    expect(error).toBeInstanceOf(DomainError);
  });

  it('should correctly initialize properties', () => {
    const error = new CommentNotFoundError();

    expect(error.name).toBe('CommentNotFoundError');
    expect(error.message).toBe('Cannot find comment');
    expect(error.code).toBe('COMMENT_NOT_FOUND');
  });

  it('should have correct message with the given comment id', () => {
    const error = new CommentNotFoundError('comment-123');
    expect(error.message).toBe('Cannot find comment with id "comment-123"');
  });
});
