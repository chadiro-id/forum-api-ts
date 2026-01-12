import { User } from '@main/domain/users/user';
import { UserRepository } from '@main/domain/users/user-repository.interface';

export class InMemoryUserRepository implements UserRepository {
  private storage: Array<User> = [];

  async add(user: User): Promise<void> {
    this.storage.push(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = this.storage.find((u) => u.username === username);
    return user ? user : null;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const result = this.storage.find((u) => u.username === username);
    return result !== undefined;
  }
}
