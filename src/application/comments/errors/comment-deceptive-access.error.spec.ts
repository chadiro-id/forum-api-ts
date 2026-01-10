import { DomainError } from '../../../domain/common/domain-error';
import { CommentDeceptiveAccessError } from './comment-deceptive-access.error';

describe('CommentDeceptiveAccessError', () => {
  it('should be instance of DomainError', () => {
    const error = new CommentDeceptiveAccessError();
    expect(error).toBeInstanceOf(DomainError);
  });

  it('should correctly initialize properties', () => {
    const error = new CommentDeceptiveAccessError();

    expect(error.name).toBe('CommentDeceptiveAccessError');
    expect(error.message).toBe('Cannot access comment');
    expect(error.code).toBe('DECEPTIVE_ACCESS');
  });
});
