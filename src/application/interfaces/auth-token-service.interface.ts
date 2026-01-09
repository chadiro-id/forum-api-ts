export interface AuthTokenPayload {
  id: string;
  username: string;
}

export interface AuthTokenService {
  createAccessToken(payload: AuthTokenPayload): Promise<string>;
  createRefreshToken(payload: AuthTokenPayload): Promise<string>;
  verifyRefreshToken(token: string): Promise<AuthTokenPayload>;
}
