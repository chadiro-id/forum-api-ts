import { UserId } from '../users/entities/user';
import { Authentication } from './entities/authentication';
import { MockAuthenticationRepository } from './authentication-repository.mock';

describe('AuthenticationRepository', () => {
  it('should enforce findByToken method', async () => {
    const repo = new MockAuthenticationRepository();

    const found = await repo.findByToken('token');
    expect(found).toBeNull();
  });

  it('should enforce add method', async () => {
    const entity = Authentication.create(new UserId('user-id'), 'token');
    const repo = new MockAuthenticationRepository();

    const id = await repo.add(entity);

    const expectedFound = Authentication.restore(
      id,
      entity.userId,
      entity.token,
    );

    const found = await repo.findByToken('token');
    expect(found).toStrictEqual(expectedFound);
  });

  it('should enforce delete method', async () => {
    const entity = Authentication.create(new UserId('user-id'), 'token');
    const repo = new MockAuthenticationRepository();

    const id = await repo.add(entity);
    const storedAuth = Authentication.restore(id, entity.userId, entity.token);

    await repo.delete(storedAuth);

    const found = await repo.findByToken('token');
    expect(found).toBeNull();
  });
});
