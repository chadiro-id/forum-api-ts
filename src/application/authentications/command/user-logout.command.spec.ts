import { UserLogoutCommand } from './user-logout.command';

describe('UserLogoutCommand', () => {
  it('should correctly initialize data', () => {
    const command = new UserLogoutCommand('refresh_token');
    expect(command.refreshToken).toBe('refresh_token');
  });
});
