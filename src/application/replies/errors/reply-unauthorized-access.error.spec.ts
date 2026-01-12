import { ApplicationError } from '../../common/errors/application-error';
import { ReplyUnauthorizedAccessError } from './reply-unauthorized-access.error';

describe('ReplyUnauthorizedAccessError', () => {
  it('should be instance of ApplicationError', () => {
    const error = new ReplyUnauthorizedAccessError();
    expect(error).toBeInstanceOf(ApplicationError);
  });

  it('should correctly initialize properties', () => {
    const error = new ReplyUnauthorizedAccessError();

    expect(error.name).toBe('ReplyUnauthorizedAccessError');
    expect(error.message).toBe('Unauthorized');
    expect(error.code).toBe('UNAUTHORIZED_ACCESS_ERROR');
  });
});
