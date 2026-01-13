import { UserId } from '../users/entities/user';
import { AuthenticationRepository } from './authentication-repository.interface';
import { Authentication, AuthenticationId } from './entities/authentication';

export class MockAuthenticationRepository implements AuthenticationRepository {
  private increment: number = 0;
  private authenticationList: Array<Authentication> = [];

  async add(authentication: Authentication): Promise<AuthenticationId> {
    const id = new AuthenticationId(++this.increment);
    authentication.assignId(id);
    this.authenticationList.push(authentication);
    return id;
  }

  async findByToken(token: string): Promise<Authentication | null> {
    const auth = this.authenticationList.find((a) => a.token === token);
    return auth ?? null;
  }

  async delete(authentication: Authentication): Promise<void> {
    this.authenticationList = this.authenticationList.filter(
      (a) => !a.equals(authentication),
    );
  }
}

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
