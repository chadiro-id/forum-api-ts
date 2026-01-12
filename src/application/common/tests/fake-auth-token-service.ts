import {
  AuthTokenPayload,
  AuthTokenService,
} from '../interfaces/auth-token-service.interface';

export class FakeAuthTokenService implements AuthTokenService {
  async createAccessToken(payload: AuthTokenPayload): Promise<string> {
    return `access-token.${payload.id}.${payload.username}`;
  }

  async createRefreshToken(payload: AuthTokenPayload): Promise<string> {
    return `refresh-token.${payload.id}.${payload.username}`;
  }

  async verifyRefreshToken(token: string): Promise<AuthTokenPayload> {
    const splitted = token.split('.');
    return {
      id: splitted[1],
      username: splitted[2],
    };
  }
}
