import { PasswordHasher } from './password-hasher.interface';

export class MockPasswordHasher implements PasswordHasher {
  async hashPassword(password: string): Promise<string> {
    return `hashed_${password}`;
  }

  async comparePassword(password: string, hashed: string): Promise<boolean> {
    return `hashed_${password}` === hashed;
  }
}

describe('PasswordHasher', () => {
  it('should enforce hashPassword method', async () => {
    const passwordHasher = new MockPasswordHasher();

    const hashed = await passwordHasher.hashPassword('p455w0rd');
    expect(hashed).not.toBe('p455w0rd');
  });

  it('should enforce comparePassword method', async () => {
    const passwordHasher = new MockPasswordHasher();

    const hashed = await passwordHasher.hashPassword('p455w0rd');

    const match = await passwordHasher.comparePassword('p455w0rd', hashed);
    expect(match).toBe(true);

    const notMatch = await passwordHasher.comparePassword('p455word', hashed);
    expect(notMatch).toBe(false);
  });
});
