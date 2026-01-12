import { AuthenticationRepository } from '../../../../domain/authentications/authentication-repository.interface';
import { RefreshTokenNotExistsError } from '../../errors/refresh-token-not-exists.error';
import { UserLogoutCommand } from '../user-logout.command';

export class UserLogoutCommandHandler {
  constructor(private authenticationRepository: AuthenticationRepository) {}

  async handle(command: UserLogoutCommand): Promise<void> {
    const authentication = await this.authenticationRepository.findByToken(
      command.refreshToken,
    );
    if (!authentication) {
      throw new RefreshTokenNotExistsError();
    }

    await this.authenticationRepository.delete(authentication);
  }
}
