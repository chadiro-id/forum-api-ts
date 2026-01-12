import { AuthTokenService } from '@main/application/common/interfaces/auth-token-service.interface';
import { PasswordHasher } from '@main/application/common/interfaces/password-hasher.interface';
import { AuthenticationRepository } from '@main/domain/authentications/authentication-repository.interface';
import { UserRepository } from '@main/domain/users/user-repository.interface';
import { UserLoginCommandHandler } from './user-login.command-handler';
import { FakeAuthTokenService } from '@main/application/common/tests/security/fake-auth-token-service';
import { InMemoryAuthenticationRepository } from '@main/application/common/tests/repository/in-memory-authentication-repository';
import { InMemoryUserRepository } from '@main/application/common/tests/repository/in-memory-user-repository';
import { FakePasswordHasher } from '@main/application/common/tests/security/fake-password-hasher';
import { User, UserId } from '@main/domain/users/user';
import { AuthenticationId } from '@main/domain/authentications/authentication';
import { UserLoginCommand } from '../user-login.command';
import { LoggedInUserReport } from '../../reports/logged-in-user.report';
import { NonExistenceUserLoginError } from '../../errors/non-existence-user-login.error';
import { InvalidCredentialsError } from '../../errors/invalid-credentials.error';

describe('UserLoginCommandHandler', () => {
  let mockAuthRepository: AuthenticationRepository;
  let mockUserRepository: UserRepository;
  let mockPasswordHasher: PasswordHasher;
  let mockAuthTokenService: AuthTokenService;
  let commandHandler: UserLoginCommandHandler;

  beforeAll(() => {
    mockAuthTokenService = new FakeAuthTokenService();
    mockAuthRepository = new InMemoryAuthenticationRepository();
    mockUserRepository = new InMemoryUserRepository();
    mockPasswordHasher = new FakePasswordHasher();

    commandHandler = new UserLoginCommandHandler(
      mockAuthRepository,
      mockUserRepository,
      mockPasswordHasher,
      mockAuthTokenService,
    );
  });

  it('should handle user login correctly', async () => {
    const mockUser = User.create(
      new UserId('user-001'),
      'johndoe',
      'hashed_p455w0rd',
      'John Doe',
    );
    mockUserRepository.findByUsername = jest.fn().mockResolvedValue(mockUser);
    mockPasswordHasher.comparePassword = jest.fn().mockResolvedValue(true);
    mockAuthTokenService.createAccessToken = jest
      .fn()
      .mockResolvedValue('access_token');
    mockAuthTokenService.createRefreshToken = jest
      .fn()
      .mockResolvedValue('refresh_token');

    mockAuthRepository.add = jest
      .fn()
      .mockResolvedValue(new AuthenticationId(1));

    const result = await commandHandler.handle(
      new UserLoginCommand('johndoe', 'p455w0rd'),
    );

    expect(result).toStrictEqual(
      new LoggedInUserReport('access_token', 'refresh_token'),
    );
    expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('johndoe');
    expect(mockPasswordHasher.comparePassword).toHaveBeenCalledWith(
      'p455w0rd',
      'hashed_p455w0rd',
    );
    expect(mockAuthTokenService.createAccessToken).toHaveBeenCalledWith({
      id: 'user-001',
      username: 'johndoe',
    });
    expect(mockAuthTokenService.createRefreshToken).toHaveBeenCalledWith({
      id: 'user-001',
      username: 'johndoe',
    });
  });

  it('should throw error when username not exists', async () => {
    mockUserRepository.findByUsername = jest.fn().mockResolvedValue(null);
    mockPasswordHasher.comparePassword = jest.fn();
    mockAuthTokenService.createAccessToken = jest.fn();
    mockAuthTokenService.createRefreshToken = jest.fn();
    mockUserRepository.add = jest.fn();

    const command = new UserLoginCommand('johndoe', 'p455w0rd');
    await expect(commandHandler.handle(command)).rejects.toThrow(
      NonExistenceUserLoginError,
    );

    expect(mockPasswordHasher.comparePassword).not.toHaveBeenCalled();
    expect(mockAuthTokenService.createAccessToken).not.toHaveBeenCalled();
    expect(mockAuthTokenService.createRefreshToken).not.toHaveBeenCalled();
    expect(mockUserRepository.add).not.toHaveBeenCalled();
  });

  it('should throw error when compare password fails', async () => {
    mockUserRepository.findByUsername = jest.fn().mockResolvedValue('johndoe');
    mockPasswordHasher.comparePassword = jest.fn().mockResolvedValue(false);
    mockUserRepository.add = jest.fn();

    const command = new UserLoginCommand('johndoe', 'p455w0rd');
    await expect(commandHandler.handle(command)).rejects.toThrow(
      InvalidCredentialsError,
    );

    expect(mockUserRepository.add).not.toHaveBeenCalled();
  });
});
