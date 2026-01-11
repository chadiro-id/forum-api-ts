import { DomainError } from '../../../domain/common/domain-error';
import { CommentForbiddenAccessError } from './comment-unauthorized-access.error';

describe('CommentForbiddenAccessError', () => {
  it('should be instance of DomainError', () => {
    const error = new CommentForbiddenAccessError();
    expect(error).toBeInstanceOf(DomainError);
  });

  it('should correctly initialize properties', () => {
    const error = new CommentForbiddenAccessError('forbidden');

    expect(error.name).toBe('CommentForbiddenAccessError');
    expect(error.message).toBe('forbidden');
    expect(error.code).toBe('FORBIDDEN_ACCESS');
  });
});
