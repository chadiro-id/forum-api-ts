import { AuthenticationRepository } from '../../../../domain/repositories/authentication-repository.interface';
import { PasswordHasher } from '../../../interfaces/password-hasher.interface';
import { AuthTokenService } from '../../../interfaces/auth-token-service.interface';
import { Authentication } from '../../../../domain/entities/authentication';
import { NonExistenceUserLoginError } from '../../errors/non-existence-user-login.error';
import { InvalidCredentialsError } from '../../errors/invalid-credentials.error';
import { UserRepository } from '../../../../domain/repositories/user-repository.interface';
import { UserLoginCommand } from '../user-login.command';
import { LoggedInUserReport } from '../../reports/logged-in-user.report';

export class UserLoginCommandHandler {
  constructor(
    private authenticationRepository: AuthenticationRepository,
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
    private authTokenService: AuthTokenService,
  ) {}

  async handle(command: UserLoginCommand): Promise<LoggedInUserReport> {
    const user = await this.userRepository.findByUsername(command.username);
    if (user === null) {
      throw new NonExistenceUserLoginError();
    }

    const isMatch = await this.passwordHasher.comparePassword(
      command.password,
      user.password,
    );
    if (!isMatch) {
      throw new InvalidCredentialsError('Compare password fails');
    }

    const tokenPayload = {
      id: user.id.value,
      username: command.username,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.authTokenService.createAccessToken(tokenPayload),
      this.authTokenService.createRefreshToken(tokenPayload),
    ]);

    const authentication = Authentication.create(user.id, refreshToken);

    const id = await this.authenticationRepository.add(authentication);
    authentication.assignId(id);

    return new LoggedInUserReport(accessToken, refreshToken);
  }
}
