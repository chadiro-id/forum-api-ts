import { ApplicationError } from '@main/application/common/errors/application-error';
import { CommentDeceptiveAccessError } from './comment-deceptive-access.error';

describe('CommentDeceptiveAccessError', () => {
  it('should be instance of ApplicationError', () => {
    const error = new CommentDeceptiveAccessError();
    expect(error).toBeInstanceOf(ApplicationError);
  });

  it('should correctly initialize properties', () => {
    const error = new CommentDeceptiveAccessError();

    expect(error.name).toBe('CommentDeceptiveAccessError');
    expect(error.message).toBe('Cannot access comment');
    expect(error.code).toBe('DECEPTIVE_ACCESS_ERROR');
  });
});
