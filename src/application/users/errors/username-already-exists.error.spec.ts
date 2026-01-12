import { ApplicationError } from '../../common/errors/application-error';
import { UsernameAlreadyExistsError } from './username-already-exists.error';

describe('UsernameAlreadyExistsError', () => {
  it('should be instance of ApplicationError', () => {
    const error = new UsernameAlreadyExistsError();
    expect(error).toBeInstanceOf(ApplicationError);
  });

  it('should correctly initialize properties', () => {
    const error = new UsernameAlreadyExistsError();

    expect(error.name).toBe('UsernameAlreadyExistsError');
    expect(error.message).toBe('Username already exists');
    expect(error.code).toBe('INVALID_OPERATION_ERROR');
  });

  it('should have correct message with the given username', () => {
    const error = new UsernameAlreadyExistsError('johndoe');
    expect(error.message).toBe('Username "johndoe" already exists');
  });
});
