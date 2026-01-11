import { ApplicationError } from '../../common/errors/application-error';
import { NonExistenceUserLoginError } from './non-existence-user-login.error';

describe('NonExistenceUserLoginError', () => {
  it('should be instance of ApplicationError', () => {
    const error = new NonExistenceUserLoginError();
    expect(error).toBeInstanceOf(ApplicationError);
  });

  it('should correctly initialize properties', () => {
    const error = new NonExistenceUserLoginError('Error message');

    expect(error.name).toBe('NonExistenceUserLoginError');
    expect(error.message).toBe('Error message');
    expect(error.code).toBe('NON_EXISTENCE_ERROR');
  });
});
