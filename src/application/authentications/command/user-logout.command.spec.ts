import { UserLogoutCommand } from './user-logout.command';

describe('UserLogoutCommand', () => {
  it('should initialize with valid data', () => {
    const command = new UserLogoutCommand('refresh_token');
    expect(command.refreshToken).toBe('refresh_token');
  });
});
