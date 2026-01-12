import { RefreshAuthCommand } from './refresh-auth.command';

describe('RefreshAuthCommand', () => {
  it('should correctly initialize data', () => {
    const command = new RefreshAuthCommand('refresh_token');
    expect(command.refreshToken).toBe('refresh_token');
  });
});
