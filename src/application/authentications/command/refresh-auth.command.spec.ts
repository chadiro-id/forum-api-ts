import { ApplicationError } from '@main/application/common/errors/application-error';
import { RefreshAuthCommand } from './refresh-auth.command';

describe('RefreshAuthCommand', () => {
  it('should correctly initialize data', () => {
    const command = new RefreshAuthCommand('refresh_token');
    expect(command.refreshToken).toBe('refresh_token');
  });

  it('should throw error when missing refreshToken', () => {
    expect(() => new RefreshAuthCommand('')).toThrow('token cannot be empty');
    expect(() => new RefreshAuthCommand(123 as unknown as string)).toThrow(
      ApplicationError,
    );
  });
});
