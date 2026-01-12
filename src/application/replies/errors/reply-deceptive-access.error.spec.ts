import { ApplicationError } from '@main/application/common/errors/application-error';
import { ReplyDeceptiveAccessError } from './reply-deceptive-access.error';

describe('ReplyDeceptiveAccessError', () => {
  it('should be instance of ApplicationError', () => {
    const error = new ReplyDeceptiveAccessError();
    expect(error).toBeInstanceOf(ApplicationError);
  });

  it('should correctly initialize properties', () => {
    const error = new ReplyDeceptiveAccessError('deceptive');

    expect(error.name).toBe('ReplyDeceptiveAccessError');
    expect(error.message).toBe('deceptive');
    expect(error.code).toBe('DECEPTIVE_ACCESS_ERROR');
  });
});
