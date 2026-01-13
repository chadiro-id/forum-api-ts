import { UserRepository } from './user-repository.interface';
import { User } from './entities/user';

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
