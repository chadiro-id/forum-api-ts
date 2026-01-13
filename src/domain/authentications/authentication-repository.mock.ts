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
