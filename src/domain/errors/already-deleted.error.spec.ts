import { DomainError } from '../common/domain-error';
import { AlreadyDeletedError } from './already-deleted.error';

describe('AlreadyDeletedError', () => {
  it('should be instance of DomainError', () => {
    const error = new AlreadyDeletedError();
    expect(error).toBeInstanceOf(DomainError);
  });

  it('should correctly initialize properties', () => {
    const error = new AlreadyDeletedError('Test message');

    expect(error.name).toBe('AlreadyDeletedError');
    expect(error.message).toBe('Test message');
    expect(error.code).toBe('ALREADY_DELETED');
  });
});
