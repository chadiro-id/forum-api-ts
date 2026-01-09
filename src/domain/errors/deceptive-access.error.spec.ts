import { DomainError } from '../common/domain-error';
import { DeceptiveAccessError } from './deceptive-access.error';

describe('DeceptiveAccessError', () => {
  it('should be instance of DomainError', () => {
    const error = new DeceptiveAccessError();
    expect(error).toBeInstanceOf(DomainError);
  });

  it('should correctly initialize properties', () => {
    const error = new DeceptiveAccessError('Test message', 'TEST_CODE');

    expect(error.name).toBe('DeceptiveAccessError');
    expect(error.message).toBe('Test message');
    expect(error.code).toBe('TEST_CODE');
  });
});
