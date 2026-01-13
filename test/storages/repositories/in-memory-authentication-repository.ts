import {
  Authentication,
  AuthenticationId,
} from '@main/domain/authentications/entities/authentication';
import { AuthenticationRepository } from '@main/domain/authentications/authentication-repository.interface';
import { FakeStorage } from '../../../src/application/common/tests/data/fake-storage-utils';

export class InMemoryAuthenticationRepository implements AuthenticationRepository {
  private increment: number = 0;
  private authList: Array<Authentication>;

  constructor(private storage: FakeStorage = new Map()) {
    this.authList =
      (this.storage.get('authentications') as Authentication[]) || [];
  }

  async add(entity: Authentication): Promise<AuthenticationId> {
    const id = new AuthenticationId(++this.increment);
    entity.assignId(id);

    this.authList.push(entity);
    return id;
  }

  async findByToken(token: string): Promise<Authentication | null> {
    const entity = this.authList.find((item) => item.token === token);
    return entity ? entity : null;
  }

  async delete(entity: Authentication): Promise<void> {
    this.authList = this.authList.filter((item) => !item.equals(entity));
  }
}
