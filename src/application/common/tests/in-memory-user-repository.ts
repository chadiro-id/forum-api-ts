import { User } from '@main/domain/entities/user';
import { UserRepository } from '@main/domain/repositories/user-repository.interface';

export class MockUserRepository implements UserRepository {
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
    return !result;
  }
}
