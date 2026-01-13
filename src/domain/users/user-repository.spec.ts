import { User, UserId } from './entities/user';
import { UserRepository } from './user-repository.interface';

export class MockUserRepository implements UserRepository {
  private userList: Array<User> = [];

  async add(user: User): Promise<void> {
    this.userList.push(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = this.userList.find((u) => u.username === username);
    return user ? user : null;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const user = this.userList.find((u) => u.username === username);
    return user instanceof User;
  }
}

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
