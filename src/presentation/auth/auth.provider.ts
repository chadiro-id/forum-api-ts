import { AuthTokenService } from '../../application/common/interfaces/auth-token-service.interface';
import { PasswordHasher } from '../../application/common/interfaces/password-hasher.interface';
import { AuthenticationRepository } from '../../domain/authentications/authentication-repository.interface';
import { UserRepository } from '../../domain/users/user-repository.interface';
import { UserLoginCommandHandler } from '../../application/authentications/command/handler/user-login.command-handler';
import { UserLogoutCommandHandler } from '../../application/authentications/command/handler/user-logout.command-handler';
import { RefreshAuthCommandHandler } from '../../application/authentications/command/handler/refresh-auth.command-handler';
import {
  AUTHENTICATION_REPOSITORY,
  PASSWORD_HASHER,
  AUTH_TOKEN_SERVICE,
  USER_REPOSITORY,
} from '../../shared/injections.constant';

export const UserLoginCommandHandlerProvider = {
  provide: UserLoginCommandHandler,
  useFactory: (
    authRepository: AuthenticationRepository,
    userRepository: UserRepository,
    passwordHasher: PasswordHasher,
    authTokenService: AuthTokenService,
  ) =>
    new UserLoginCommandHandler(
      authRepository,
      userRepository,
      passwordHasher,
      authTokenService,
    ),
  inject: [
    AUTHENTICATION_REPOSITORY,
    USER_REPOSITORY,
    PASSWORD_HASHER,
    AUTH_TOKEN_SERVICE,
  ],
};

export const UserLogoutCommandHandlerProvider = {
  provide: UserLogoutCommandHandler,
  useFactory: (authenticationRepository: AuthenticationRepository) =>
    new UserLogoutCommandHandler(authenticationRepository),
  inject: [AUTHENTICATION_REPOSITORY],
};

export const RefreshAuthCommandHandlerProvider = {
  provide: RefreshAuthCommandHandler,
  useFactory: (
    authenticationRepository: AuthenticationRepository,
    authTokenService: AuthTokenService,
  ) =>
    new RefreshAuthCommandHandler(authenticationRepository, authTokenService),
  inject: [AUTHENTICATION_REPOSITORY, AUTH_TOKEN_SERVICE],
};
