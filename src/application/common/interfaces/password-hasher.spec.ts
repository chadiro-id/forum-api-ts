import { MockPasswordHasher } from './password-hasher.mock';

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
