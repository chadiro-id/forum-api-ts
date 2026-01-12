import { UserLoginCommand } from './user-login.command';

describe('UserLoginCommand', () => {
  it('should correctly initialize data', () => {
    const command = new UserLoginCommand('johndoe', 'p455w0rd');

    expect(command.username).toBe('johndoe');
    expect(command.password).toBe('p455w0rd');
  });
});
