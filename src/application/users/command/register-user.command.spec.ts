import { ApplicationError } from '@main/application/common/errors/application-error';
import { RegisterUserCommand } from './register-user.command';

describe('RegisterUserCommand', () => {
  it('should correctly initialize data', () => {
    const command = new RegisterUserCommand('johndoe', 'p455w0rd', 'John Doe');

    expect(command.username).toBe('johndoe');
    expect(command.password).toBe('p455w0rd');
    expect(command.fullname).toBe('John Doe');
  });

  it('should throw error when missing arguments', () => {
    const missing = undefined as unknown as string;

    expect(
      () => new RegisterUserCommand(missing, 'p455w0rd', 'John Doe'),
    ).toThrow(ApplicationError);
    expect(
      () => new RegisterUserCommand('johndoe', missing, 'John Doe'),
    ).toThrow(ApplicationError);
    expect(
      () => new RegisterUserCommand('johndoe', 'p455w0rd', missing),
    ).toThrow(ApplicationError);
  });

  it('should throw error when data type mismatch', () => {
    const notString = 123 as unknown as string;

    expect(
      () => new RegisterUserCommand(notString, 'p455w0rd', 'John Doe'),
    ).toThrow(ApplicationError);
    expect(
      () => new RegisterUserCommand('johndoe', notString, 'John Doe'),
    ).toThrow(ApplicationError);
    expect(
      () => new RegisterUserCommand('johndoe', 'p455w0rd', notString),
    ).toThrow(ApplicationError);
  });
});
