import { User, UserId } from './entities/user';
import { MockUserRepository } from './user-repository.mock';

describe('UserRepository', () => {
  it('should enforce findByUsername method', async () => {
    const repo = new MockUserRepository();

    const user = await repo.findByUsername('johndoe');
    expect(user).toBeNull();
  });

  it('should enforce exixtsByUsername method', async () => {
    const repo = new MockUserRepository();

    const exists = await repo.existsByUsername('johndoe');
    expect(exists).toBe(false);
  });

  it('should enforce add method', async () => {
    const repo = new MockUserRepository();

    const user = User.create(
      new UserId('user-001'),
      'johndoe',
      'p455w0rd',
      'John Doe',
    );
    await repo.add(user);

    const exists = await repo.existsByUsername('johndoe');
    expect(exists).toBe(true);

    const foundUser = await repo.findByUsername('johndoe');
    expect(foundUser).toStrictEqual(user);
  });
});
