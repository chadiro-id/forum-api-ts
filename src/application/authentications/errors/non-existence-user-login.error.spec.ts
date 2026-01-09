import { DomainError } from '../../../domain/common/domain-error';
import { NonExistenceUserLoginError } from './non-existence-user-login.error';

describe('NonExistenceUserLoginError', () => {
  it('should be instance of DomainError', () => {
    const error = new NonExistenceUserLoginError();
    expect(error).toBeInstanceOf(DomainError);
  });

  it('should correctly initialize properties', () => {
    const error = new NonExistenceUserLoginError('Error message');

    expect(error.name).toBe('NonExistenceUserLoginError');
    expect(error.message).toBe('Error message');
    expect(error.code).toBe('NON_EXISTENCE_USER_LOGIN');
  });
});
