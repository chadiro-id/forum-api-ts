import { DomainError } from '../../../domain/common/domain-error';
import { ReplyNotFoundError } from './reply-not-found.error';

describe('ReplyNotFoundError', () => {
  it('should be instance of DomainError', () => {
    const error = new ReplyNotFoundError();

    expect(error).toBeInstanceOf(DomainError);
  });

  it('should correctly initialize properties', () => {
    const error = new ReplyNotFoundError();

    expect(error.name).toBe('ReplyNotFoundError');
    expect(error.message).toBe('Cannot find reply');
    expect(error.code).toBe('REPLY_NOT_FOUND');
  });

  it('should have correct message with the given reply id', () => {
    const error = new ReplyNotFoundError('reply-123');

    expect(error.message).toBe('Cannot find reply with id "reply-123"');
  });
});
