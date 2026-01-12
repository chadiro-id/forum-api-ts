import { User, UserId } from '../../../../domain/users/user';
import { UserRepository } from '../../../../domain/users/user-repository.interface';
import { PasswordHasher } from '../../../common/interfaces/password-hasher.interface';
import { RegisterUserCommandHandler } from './register-user.command-handler';
import { RegisterUserCommand } from '../register-user.command';
import { RegisteredUserReport } from '../../reports/registered-user.report';
import { UsernameAlreadyExistsError } from '../../errors/username-already-exists.error';
jest.useFakeTimers();

class MockUserRepository implements UserRepository {
  add(_user: User): Promise<void> {
    throw new Error('Method not implemented');
  }

  findByUsername(_username: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }

  existsByUsername(_username: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

class MockPasswordHasher implements PasswordHasher {
  hashPassword(_password: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
  comparePassword(_password: string, _hashed: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

describe('RegisterUserCommandHandler', () => {
  let mockUserRepo: UserRepository;
  let mockPasswordHasher: PasswordHasher;
  let commandHandler: RegisterUserCommandHandler;

  beforeEach(() => {
    mockUserRepo = new MockUserRepository();
    mockPasswordHasher = new MockPasswordHasher();
    commandHandler = new RegisterUserCommandHandler(
      mockUserRepo,
      mockPasswordHasher,
      () => 'user-001',
    );
  });

  it('should correctly handle user registrations', async () => {
    mockUserRepo.existsByUsername = jest.fn().mockImplementation(() => false);
    mockPasswordHasher.hashPassword = jest
      .fn()
      .mockImplementation(() => 'hashedPassword');
    mockUserRepo.add = jest
      .fn()
      .mockImplementation(
        () => new RegisteredUserReport('user-001', 'johndoe', 'John Doe'),
      );

    const calledUser = User.create(
      new UserId('user-001'),
      'johndoe',
      'hashedPassword',
      'John Doe',
    );
    const expectedResult = RegisteredUserReport.fromEntity(calledUser);

    const command = new RegisterUserCommand('johndoe', 'p455w0rd', 'John Doe');
    const result = await commandHandler.handle(command);
    expect(result).toStrictEqual(expectedResult);

    expect(mockUserRepo.existsByUsername).toHaveBeenCalledWith('johndoe');
    expect(mockPasswordHasher.hashPassword).toHaveBeenCalledWith('p455w0rd');
    expect(mockUserRepo.add).toHaveBeenCalledWith(calledUser);
  });

  it('should throw error when username already exists', async () => {
    mockUserRepo.existsByUsername = jest.fn().mockResolvedValue(true);
    mockPasswordHasher.hashPassword = jest.fn();
    mockUserRepo.add = jest.fn();

    const command = new RegisterUserCommand('johndoe', 'p455w0rd', 'John Doe');
    await expect(commandHandler.handle(command)).rejects.toThrow(
      UsernameAlreadyExistsError,
    );

    expect(mockPasswordHasher.hashPassword).not.toHaveBeenCalled();
    expect(mockUserRepo.add).not.toHaveBeenCalled();
  });
});
