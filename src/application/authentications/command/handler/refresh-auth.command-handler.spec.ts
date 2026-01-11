import {
  AuthTokenPayload,
  AuthTokenService,
} from '@main/application/common/interfaces/auth-token-service.interface';
import { AuthenticationRepository } from '@main/domain/repositories/authentication-repository.interface';
import { RefreshAuthCommandHandler } from './refresh-auth.command-handler';
import { MockAuthenticationRepository } from '@main/application/common/tests/mock-authentication-repository';
import { MockAuthTokenService } from '@main/application/common/tests/mock-auth-token-service';
import {
  Authentication,
  AuthenticationId,
} from '@main/domain/entities/authentication';
import { UserId } from '@main/domain/entities/user';
import { RefreshAuthCommand } from '../refresh-auth.command';
import { RefreshedAuthReport } from '../../reports/refreshed-auth.report';
import { RefreshTokenNotExistsError } from '../../errors/refresh-token-not-exists.error';

describe('RefreshAuthCommandHandler', () => {
  let mockAuthenticationRepository: AuthenticationRepository;
  let mockAuthTokenService: AuthTokenService;
  let commandHandler: RefreshAuthCommandHandler;

  beforeAll(() => {
    mockAuthenticationRepository = new MockAuthenticationRepository();
    mockAuthTokenService = new MockAuthTokenService();
    commandHandler = new RefreshAuthCommandHandler(
      mockAuthenticationRepository,
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
    const mockAuthentication = Authentication.create(userId, 'refresh_token');
    mockAuthentication.assignId(id);

    mockAuthTokenService.verifyRefreshToken = jest
      .fn()
      .mockResolvedValue(mockAuthToken);
    mockAuthenticationRepository.findByToken = jest
      .fn()
      .mockResolvedValue(mockAuthentication);
    mockAuthTokenService.createAccessToken = jest
      .fn()
      .mockResolvedValue('new_access_token');

    const command = new RefreshAuthCommand('refresh_token');
    const result = await commandHandler.handle(command);

    expect(result).toStrictEqual(new RefreshedAuthReport('new_access_token'));
    expect(mockAuthTokenService.verifyRefreshToken).toHaveBeenCalledWith(
      'refresh_token',
    );
    expect(mockAuthenticationRepository.findByToken).toHaveBeenCalledWith(
      'refresh_token',
    );
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
    mockAuthenticationRepository.findByToken = jest
      .fn()
      .mockResolvedValue(null);
    mockAuthTokenService.createAccessToken = jest.fn();

    const command = new RefreshAuthCommand('refresh_token');
    await expect(commandHandler.handle(command)).rejects.toThrow(
      RefreshTokenNotExistsError,
    );

    expect(mockAuthTokenService.createAccessToken).not.toHaveBeenCalled();
  });
});
