import { User } from '@main/domain/users/entities/user';
import { UserRepository } from '@main/domain/users/user-repository.interface';
import { FakeStorage } from '../../../src/application/common/tests/data/fake-storage-utils';

export class InMemoryUserRepository implements UserRepository {
  private userList: Array<User>;

  constructor(private storage: FakeStorage = new Map()) {
    this.userList = (this.storage.get('users') as User[]) || [];
  }

  async add(user: User): Promise<void> {
    this.userList.push(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = this.userList.find((u) => u.username === username);
    return user ? user : null;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const result = this.userList.find((u) => u.username === username);
    return result !== undefined;
  }
}
