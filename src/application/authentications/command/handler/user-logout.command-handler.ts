import { AuthenticationRepository } from '../../../../domain/repositories/authentication-repository.interface';
import { RefreshTokenNotFoundError } from '../../errors/refresh-token-not-exists.error';
import { UserLogoutCommand } from '../user-logout.command';

export class UserLogoutCommandHandler {
  constructor(private authenticationRepository: AuthenticationRepository) {}

  async handle(command: UserLogoutCommand): Promise<void> {
    const authentication = await this.authenticationRepository.findByToken(
      command.refreshToken,
    );
    if (!authentication) {
      throw new RefreshTokenNotFoundError();
    }

    await this.authenticationRepository.delete(authentication);
  }
}
