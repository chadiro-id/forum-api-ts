import { ApplicationError } from '../../common/errors/application-error';
import { CommentUnauthorizedAccessError } from './comment-unauthorized-access.error';

describe('CommentForbiddenAccessError', () => {
  it('should be instance of ApplicationError', () => {
    const error = new CommentUnauthorizedAccessError('');
    expect(error).toBeInstanceOf(ApplicationError);
  });

  it('should correctly initialize properties', () => {
    const error = new CommentUnauthorizedAccessError('unauthorized');

    expect(error.name).toBe('CommentUnauthorizedAccessError');
    expect(error.message).toBe('unauthorized');
    expect(error.code).toBe('UNAUTHORIZED_ACCESS_ERROR');
  });
});
