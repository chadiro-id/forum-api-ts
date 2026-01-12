import { ApplicationError } from '../../common/errors/application-error';
import { ReplyNotFoundError } from './reply-not-found.error';

describe('ReplyNotFoundError', () => {
  it('should be instance of ApplicationError', () => {
    const error = new ReplyNotFoundError();

    expect(error).toBeInstanceOf(ApplicationError);
  });

  it('should correctly initialize properties', () => {
    const error = new ReplyNotFoundError();

    expect(error.name).toBe('ReplyNotFoundError');
    expect(error.message).toBe('Cannot find reply');
    expect(error.code).toBe('KEY_NOT_FOUND_ERROR');
  });

  it('should have correct message with the given reply id', () => {
    const error = new ReplyNotFoundError('reply-123');

    expect(error.message).toBe('Cannot find reply with id "reply-123"');
  });
});
