import {
  AuthTokenService,
  AuthTokenPayload,
} from './auth-token-service.interface';

export class MockAuthTokenService implements AuthTokenService {
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

describe('AuthTokenService', () => {
  it('should enforce createAccessToken method', async () => {
    const authTokenService = new MockAuthTokenService();
    const token = await authTokenService.createAccessToken({
      id: 'id',
      username: 'username',
    });
    expect(token.includes(' ')).toBe(false);
  });

  it('should enforce createRefreshToken method', async () => {
    const service = new MockAuthTokenService();

    const token = await service.createRefreshToken({
      id: 'id',
      username: 'username',
    });
    expect(token.includes(' ')).toBe(false);
  });

  it('should enforce verifyRefreshToken method', async () => {
    const service = new MockAuthTokenService();

    const token = await service.createRefreshToken({
      id: 'id',
      username: 'username',
    });

    const payload = await service.verifyRefreshToken(token);
    expect(payload).toMatchObject({
      id: 'id',
      username: 'username',
    });
  });
});
