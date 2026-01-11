import { DomainError } from '../../../domain/common/domain-error';
import { ReplyUnauthorizedAccessError } from './reply-unauthorized-access.error';

describe('ReplyUnauthorizedAccessError', () => {
  it('should be instance of ApplicationError', () => {
    const error = new ReplyUnauthorizedAccessError('');
    expect(error).toBeInstanceOf(DomainError);
  });

  it('should correctly initialize properties', () => {
    const error = new ReplyUnauthorizedAccessError('');

    expect(error.name).toBe('ReplyForbiddenAccessError');
    expect(error.message).toBe('forbidden');
    expect(error.code).toBe('FORBIDDEN_ACCESS');
  });
});
