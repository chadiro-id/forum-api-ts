import * as jwt from 'jsonwebtoken';
import {
  AuthTokenService,
  AuthTokenPayload,
} from '../../application/common/interfaces/auth-token-service.interface';
import { Injectable } from '../../libs/my-app/common/injections/injections.decorator';
import { InvariantError } from '../../shared/errors/invariant-error';
import type { JwtConfigType } from '../config/jwt.config';
import { ConfigService } from '../config/config-service';
import jwtConfig from '../config/jwt.config';

@Injectable()
export class JwtTokenService implements AuthTokenService {
  private config: JwtConfigType;

  constructor(configService: ConfigService) {
    this.config = configService.get(jwtConfig.key);
  }

  private signAsync(
    payload: string | object | Buffer<ArrayBufferLike>,
    secret: jwt.Secret | jwt.PrivateKey,
    options?: jwt.SignOptions,
  ): Promise<string | undefined> {
    return new Promise((resolve, reject) =>
      jwt.sign(payload, secret, { ...options }, (error, encoded) =>
        error ? reject(error) : resolve(encoded),
      ),
    );
  }

  private verifyAsync(
    token: string,
    secret: jwt.Secret,
  ): Promise<string | jwt.JwtPayload | undefined> {
    return new Promise((resolve, reject) =>
      jwt.verify(token, secret, (error, decoded) =>
        error ? reject(error) : resolve(decoded),
      ),
    );
  }

  async createAccessToken(payload: AuthTokenPayload): Promise<string> {
    const secret = this.config.accessToken.secret;
    const expiresIn = this.config.accessToken.expirationTime;
    const token = await this.signAsync(payload, secret, {
      expiresIn,
    });
    return token as string;
  }

  async createRefreshToken(payload: AuthTokenPayload): Promise<string> {
    const secret = this.config.refreshToken.secret;
    const token = await this.signAsync(payload, secret);
    return token as string;
  }

  async verifyAccessToken(token: string): Promise<AuthTokenPayload> {
    const secret = this.config.accessToken.secret;
    try {
      const decoded = await this.verifyAsync(token, secret);
      return decoded as AuthTokenPayload;
    } catch (error) {
      console.error(error);
      throw new InvariantError('access token tidak valid');
    }
  }

  async verifyRefreshToken(token: string): Promise<AuthTokenPayload> {
    try {
      const secret = this.config.refreshToken.secret;
      const result = await this.verifyAsync(token, secret);
      return result as AuthTokenPayload;
    } catch (error) {
      console.error(error);
      throw new InvariantError('refresh token tidak valid');
    }
  }
}
