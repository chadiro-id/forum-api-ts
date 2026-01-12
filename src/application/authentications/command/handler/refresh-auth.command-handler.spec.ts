import {
  AuthTokenPayload,
  AuthTokenService,
} from '@main/application/common/interfaces/auth-token-service.interface';
import { AuthenticationRepository } from '@main/domain/authentications/authentication-repository.interface';
import { RefreshAuthCommandHandler } from './refresh-auth.command-handler';
import { InMemoryAuthenticationRepository } from '@main/application/common/tests/repository/in-memory-authentication-repository';
import { FakeAuthTokenService } from '@main/application/common/tests/security/fake-auth-token-service';
import {
  Authentication,
  AuthenticationId,
} from '@main/domain/authentications/authentication';
import { UserId } from '@main/domain/entities/user';
import { RefreshAuthCommand } from '../refresh-auth.command';
import { RefreshedAuthReport } from '../../reports/refreshed-auth.report';
import { RefreshTokenNotExistsError } from '../../errors/refresh-token-not-exists.error';

describe('RefreshAuthCommandHandler', () => {
  let mockAuthRepo: AuthenticationRepository;
  let mockAuthTokenService: AuthTokenService;
  let commandHandler: RefreshAuthCommandHandler;

  beforeAll(() => {
    mockAuthRepo = new InMemoryAuthenticationRepository();
    mockAuthTokenService = new FakeAuthTokenService();
    commandHandler = new RefreshAuthCommandHandler(
      mockAuthRepo,
      mockAuthTokenService,
    );
  });

  it('should handle refresh auth correctly', async () => {
    const mockAuthToken: AuthTokenPayload = {
      id: 'user-001',
      username: 'johndoe',
    };
    const id = new AuthenticationId(1);
    const userId = new UserId('user-001');
    const mockAuthEntity = Authentication.restore(id, userId, 'refresh_token');

    mockAuthTokenService.verifyRefreshToken = jest
      .fn()
      .mockResolvedValue(mockAuthToken);
    mockAuthRepo.findByToken = jest.fn().mockResolvedValue(mockAuthEntity);
    mockAuthTokenService.createAccessToken = jest
      .fn()
      .mockResolvedValue('new_access_token');

    const command = new RefreshAuthCommand('refresh_token');
    const result = await commandHandler.handle(command);

    expect(result).toStrictEqual(new RefreshedAuthReport('new_access_token'));
    expect(mockAuthTokenService.verifyRefreshToken).toHaveBeenCalledWith(
      'refresh_token',
    );
    expect(mockAuthRepo.findByToken).toHaveBeenCalledWith('refresh_token');
    expect(mockAuthTokenService.createAccessToken).toHaveBeenCalledWith({
      id: 'user-001',
      username: 'johndoe',
    });
  });

  it('should throw error when refresh token not exists', async () => {
    mockAuthTokenService.verifyRefreshToken = jest.fn().mockResolvedValue({
      id: 'user-001',
      username: 'johndoe',
    });
    mockAuthRepo.findByToken = jest.fn().mockResolvedValue(null);
    mockAuthTokenService.createAccessToken = jest.fn();

    const command = new RefreshAuthCommand('refresh_token');
    await expect(commandHandler.handle(command)).rejects.toThrow(
      RefreshTokenNotExistsError,
    );

    expect(mockAuthTokenService.createAccessToken).not.toHaveBeenCalled();
  });
});
