import { AuthenticationRepository } from '../../../../domain/repositories/authentication-repository.interface';
import { RefreshTokenNotFoundError } from '../../errors/refresh-token-not-exists.error';
import { RefreshedAuthReport } from '../../reports/refreshed-auth.report';
import { RefreshAuthCommand } from '../refresh-auth.command';
import { AuthTokenService } from '../../../common/interfaces/auth-token-service.interface';

export class RefreshAuthCommandHandler {
  constructor(
    private authenticationRepository: AuthenticationRepository,
    private authTokenService: AuthTokenService,
  ) {}

  async handle(command: RefreshAuthCommand): Promise<RefreshedAuthReport> {
    const decodedPayload = await this.authTokenService.verifyRefreshToken(
      command.refreshToken,
    );

    const authentication = await this.authenticationRepository.findByToken(
      command.refreshToken,
    );
    if (!authentication) {
      throw new RefreshTokenNotFoundError();
    }

    const accessToken = await this.authTokenService.createAccessToken({
      id: decodedPayload.id,
      username: decodedPayload.username,
    });

    return new RefreshedAuthReport(accessToken);
  }
}
