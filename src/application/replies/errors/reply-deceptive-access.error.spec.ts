import { DomainError } from '../../../domain/common/domain-error';
import { ReplyDeceptiveAccessError } from './reply-deceptive-access.error';

describe('ReplyDeceptiveAccessError', () => {
  it('should be instance of DomainError', () => {
    const error = new ReplyDeceptiveAccessError();
    expect(error).toBeInstanceOf(DomainError);
  });

  it('should correctly initialize properties', () => {
    const error = new ReplyDeceptiveAccessError('deceptive');

    expect(error.name).toBe('ReplyDeceptiveAccessError');
    expect(error.message).toBe('deceptive');
    expect(error.code).toBe('DECEPTIVE_ACCESS');
  });
});
