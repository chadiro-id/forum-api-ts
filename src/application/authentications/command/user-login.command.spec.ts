import { UserLoginCommand } from './user-login.command';

describe('UserLoginCommand', () => {
  it('should correctly initialize data', () => {
    const command = new UserLoginCommand('johndoe', 'p455w0rd');

    expect(command.username).toBe('johndoe');
    expect(command.password).toBe('p455w0rd');
  });

  it('should throw error when missing username', () => {
    expect(() => new UserLoginCommand('', 'p455w0rd')).toThrow(
      'username cannot be empty',
    );
    expect(
      () => new UserLoginCommand(true as unknown as string, 'p455w0rd'),
    ).toThrow('username cannot be empty');
  });

  it('should throw error when missing password', () => {
    expect(() => new UserLoginCommand('johndoe', '')).toThrow(
      'password cannot be empty',
    );
    expect(
      () => new UserLoginCommand('johndoe', ['password'] as unknown as string),
    ).toThrow('password cannot be empty');
  });
});
