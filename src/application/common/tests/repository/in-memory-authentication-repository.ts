import {
  Authentication,
  AuthenticationId,
} from '@main/domain/authentications/entities/authentication';
import { AuthenticationRepository } from '@main/domain/authentications/authentication-repository.interface';

export class InMemoryAuthenticationRepository implements AuthenticationRepository {
  private increment: number = 0;
  private storage: Array<Authentication> = [];

  async add(entity: Authentication): Promise<AuthenticationId> {
    const id = new AuthenticationId(++this.increment);
    entity.assignId(id);

    this.storage.push(entity);
    return id;
  }

  async findByToken(token: string): Promise<Authentication | null> {
    const entity = this.storage.find((item) => item.token === token);
    return entity ? entity : null;
  }

  async delete(entity: Authentication): Promise<void> {
    this.storage = this.storage.filter((item) => !item.equals(entity));
  }
}
