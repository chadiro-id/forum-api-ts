import { ApplicationError } from '@main/application/common/errors/application-error';
import { UserLogoutCommand } from './user-logout.command';

describe('UserLogoutCommand', () => {
  it('should correctly initialize data', () => {
    const command = new UserLogoutCommand('refresh_token');
    expect(command.refreshToken).toBe('refresh_token');
  });

  it('should throw error when missing refreshToken', () => {
    expect(() => new UserLogoutCommand('')).toThrow('token cannot be empty');
    expect(() => new UserLogoutCommand(123 as unknown as string)).toThrow(
      ApplicationError,
    );
  });
});
