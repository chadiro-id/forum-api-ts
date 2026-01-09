import { DomainError } from '../../../domain/common/domain-error';
import { UsernameAlreadyExistsError } from './username-already-exists.error';

describe('UsernameAlreadyExistsError', () => {
  it('should be instance of DomainError', () => {
    const error = new UsernameAlreadyExistsError();
    expect(error).toBeInstanceOf(DomainError);
  });

  it('should correctly initialize properties', () => {
    const error = new UsernameAlreadyExistsError();

    expect(error.name).toBe('UsernameAlreadyExistsError');
    expect(error.message).toBe('Username already exists');
    expect(error.code).toBe('USERNAME_ALREADY_EXISTS');
  });

  it('should have correct message with the given username', () => {
    const error = new UsernameAlreadyExistsError('johndoe');
    expect(error.message).toBe('Username "johndoe" already exists');
  });
});
