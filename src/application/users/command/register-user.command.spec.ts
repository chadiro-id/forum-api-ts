import { RegisterUserCommand } from './register-user.command';

describe('RegisterUserCommand', () => {
  it('should correctly initialize property', () => {
    const command = new RegisterUserCommand('johndoe', 'p455w0rd', 'John Doe');

    expect(command.username).toBe('johndoe');
    expect(command.password).toBe('p455w0rd');
    expect(command.fullname).toBe('John Doe');
  });
});
