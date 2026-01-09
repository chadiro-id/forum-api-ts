import { DomainError } from '../../../domain/common/domain-error';
import { InvalidCredentialsError } from './invalid-credentials.error';

describe('InvalidCredentialsError', () => {
  it('should be instance of DomainError', () => {
    const error = new InvalidCredentialsError();
    expect(error).toBeInstanceOf(DomainError);
  });

  it('should correctly initialize properties', () => {
    const error = new InvalidCredentialsError('Error message');

    expect(error.name).toBe('InvalidCredentialsError');
    expect(error.message).toBe('Error message');
    expect(error.code).toBe('INVALID_CREDENTIALS');
  });
});
