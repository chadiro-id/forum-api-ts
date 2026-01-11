import { UserRepository } from '../../domain/repositories/user-repository.interface';
import { PasswordHasher } from '../../application/common/interfaces/password-hasher.interface';
import { RegisterUserCommandHandler } from '../../application/users/command/handler/register-user.command-handler';
import {
  ID_GENERATOR,
  USER_REPOSITORY,
  PASSWORD_HASHER,
} from '../../shared/injections.constant';

export const RegisterUserCommandHandlerProvider = {
  provide: RegisterUserCommandHandler,
  useFactory: (
    userRepository: UserRepository,
    passwordHasher: PasswordHasher,
    idGenerator: () => string,
  ) =>
    new RegisterUserCommandHandler(userRepository, passwordHasher, idGenerator),
  inject: [USER_REPOSITORY, PASSWORD_HASHER, ID_GENERATOR],
};
