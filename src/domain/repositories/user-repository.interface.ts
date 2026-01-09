import { User } from '../entities/user';

export interface UserRepository {
  add(user: User): Promise<void>;
  findByUsername(username: string): Promise<User | null>;
  existsByUsername(username: string): Promise<boolean>;
}
