import { Authentication, AuthenticationId } from './entities/authentication';

export interface AuthenticationRepository {
  add(authentication: Authentication): Promise<AuthenticationId>;
  findByToken(token: string): Promise<Authentication | null>;
  delete(authentication: Authentication): Promise<void>;
}
