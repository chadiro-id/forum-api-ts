import { ApplicationError } from './application-error';

describe('ApplicationError', () => {
  it('should be instance of Error', () => {
    const error = new ApplicationError('', 'APPLICATION_ERROR');
    expect(error).toBeInstanceOf(Error);
  });

  it('should correctly create instance', () => {
    const error = new ApplicationError('Something error', 'APPLICATION_ERROR');

    expect(error.name).toBe('ApplicationError');
    expect(error.message).toBe('Something error');
    expect(error.code).toBe('APPLICATION_ERROR');
  });
});
