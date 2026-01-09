import { UserRepository } from '../../../../domain/repositories/user-repository.interface';
import { PasswordHasher } from '../../../interfaces/password-hasher.interface';
import { User, UserId } from '../../../../domain/entities/user';
import { UsernameAlreadyExistsError } from '../../errors/username-already-exists.error';
import { RegisterUserCommand } from '../register-user.command';
import { RegisteredUserReport } from '../../reports/registered-user.report';

export class RegisterUserCommandHandler {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
    private idGenerator: () => string,
  ) {}

  async handle(command: RegisterUserCommand): Promise<RegisteredUserReport> {
    const { username, password, fullname } = command;

    const exists = await this.userRepository.existsByUsername(username);
    if (exists) {
      throw new UsernameAlreadyExistsError();
    }

    const userId = new UserId(this.idGenerator());
    const hashedPassword = await this.passwordHasher.hashPassword(password);
    const user = User.create(userId, username, hashedPassword, fullname);

    await this.userRepository.add(user);

    return RegisteredUserReport.fromEntity(user);
  }
}
