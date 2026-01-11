import { DomainError } from '../../../domain/common/domain-error';
import { ReplyForbiddenAccessError } from './reply-forbidden-access.error';

describe('ReplyForbiddenAccessError', () => {
  it('should be instance of DomainError', () => {
    const error = new ReplyForbiddenAccessError();
    expect(error).toBeInstanceOf(DomainError);
  });

  it('should correctly initialize properties', () => {
    const error = new ReplyForbiddenAccessError('forbidden');

    expect(error.name).toBe('ReplyForbiddenAccessError');
    expect(error.message).toBe('forbidden');
    expect(error.code).toBe('FORBIDDEN_ACCESS');
  });
});
