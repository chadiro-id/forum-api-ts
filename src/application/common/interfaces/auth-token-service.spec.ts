import { MockAuthTokenService } from './auth-token-service.mock';

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
