import { PasswordHasher } from '../../interfaces/password-hasher.interface';

export class FakePasswordHasher implements PasswordHasher {
  async hashPassword(password: string): Promise<string> {
    return `hashed_${password}`;
  }

  async comparePassword(password: string, hashed: string): Promise<boolean> {
    return `hashed_${password}` === hashed;
  }
}
