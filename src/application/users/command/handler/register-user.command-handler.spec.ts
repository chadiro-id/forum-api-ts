import { User, UserId } from '../../../../domain/users/entities/user';
import { UserRepository } from '../../../../domain/users/user-repository.interface';
import { PasswordHasher } from '../../../common/interfaces/password-hasher.interface';
import { RegisterUserCommandHandler } from './register-user.command-handler';
import { RegisterUserCommand } from '../register-user.command';
import { RegisteredUserReport } from '../../reports/registered-user.report';
import { UsernameAlreadyExistsError } from '../../errors/username-already-exists.error';
import { MockUserRepository } from '@main/domain/users/user-repository.mock';
import { MockPasswordHasher } from '@main/application/common/interfaces/password-hasher.spec';

jest.useFakeTimers();
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
    const expectedResult = new RegisteredUserReport(
      'user-001',
      'johndoe',
      'John Doe',
    );

    const command = new RegisterUserCommand('johndoe', 'p455w0rd', 'John Doe');
    const result = await commandHandler.handle(command);

    expect(result).toStrictEqual(expectedResult);

    expect(mockUserRepo.existsByUsername).toHaveBeenCalledTimes(1);
    expect(mockUserRepo.existsByUsername).toHaveBeenCalledWith('johndoe');
    expect(mockPasswordHasher.hashPassword).toHaveBeenCalledTimes(1);
    expect(mockPasswordHasher.hashPassword).toHaveBeenCalledWith('p455w0rd');
    expect(mockUserRepo.add).toHaveBeenCalledTimes(1);
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
