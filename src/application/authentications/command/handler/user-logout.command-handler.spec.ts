import { AuthenticationRepository } from '@main/domain/authentications/authentication-repository.interface';
import { InMemoryAuthenticationRepository } from '@main/application/common/tests/repository/in-memory-authentication-repository';
import { UserLogoutCommandHandler } from './user-logout.command-handler';
import {
  Authentication,
  AuthenticationId,
} from '@main/domain/authentications/authentication';
import { UserId } from '@main/domain/users/entities/user';
import { UserLogoutCommand } from '../user-logout.command';
import { RefreshTokenNotExistsError } from '../../errors/refresh-token-not-exists.error';

describe('UserLogoutCommandHandler', () => {
  let mockAuthRepo: AuthenticationRepository;
  let commandHandler: UserLogoutCommandHandler;

  beforeAll(() => {
    mockAuthRepo = new InMemoryAuthenticationRepository();
    commandHandler = new UserLogoutCommandHandler(mockAuthRepo);
  });

  it('should handle user logout correctly', async () => {
    const id = new AuthenticationId(1);
    const userId = new UserId('user-001');
    const mockValueAuth = Authentication.restore(id, userId, 'refresh_token');

    const calledAuth = Authentication.restore(id, userId, 'refresh_token');

    mockAuthRepo.findByToken = jest.fn().mockResolvedValue(mockValueAuth);
    mockAuthRepo.delete = jest.fn().mockResolvedValue(undefined);

    const command = new UserLogoutCommand('refresh_token');
    await commandHandler.handle(command);

    expect(mockAuthRepo.findByToken).toHaveBeenCalledWith('refresh_token');
    expect(mockAuthRepo.delete).toHaveBeenCalledWith(calledAuth);
  });

  it('should throw error when refresh token not exists', async () => {
    mockAuthRepo.findByToken = jest.fn().mockResolvedValue(null);
    mockAuthRepo.delete = jest.fn();

    const command = new UserLogoutCommand('refresh_token');
    await expect(commandHandler.handle(command)).rejects.toThrow(
      RefreshTokenNotExistsError,
    );

    expect(mockAuthRepo.findByToken).toHaveBeenCalledWith('refresh_token');
    expect(mockAuthRepo.delete).not.toHaveBeenCalled();
  });
});
