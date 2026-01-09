import { createServerTest, ServerTest } from '@test/helper/server-test.helper';
import pgTest from '@test/helper/database/postgres-test.helper';
import { PG_POOL } from '@main/infrastructure/database/database.module';
import { Pool } from 'pg';
import { AuthTokenService } from '@main/application/interfaces/auth-token-service.interface';
import { PasswordHasher } from '@main/application/interfaces/password-hasher.interface';
import {
  AUTH_TOKEN_SERVICE,
  PASSWORD_HASHER,
} from '@main/shared/injections.constant';
import { createUserData } from '@test/helper/data-factory';

let serverTest: ServerTest;
let authTokenService: AuthTokenService;
let passwordHasher: PasswordHasher;

beforeAll(async () => {
  serverTest = createServerTest();
  serverTest.init();

  authTokenService = serverTest.getResolvedInstance(AUTH_TOKEN_SERVICE);
  passwordHasher = serverTest.getResolvedInstance(PASSWORD_HASHER);
  const pool = serverTest.getResolvedInstance<Pool>(PG_POOL);
  pgTest.setup(pool);

  await pgTest.truncate();
});

afterAll(async () => {
  await pgTest.end();
});

describe('Authentications Endpoint', () => {
  afterEach(async () => {
    await pgTest.authentications().cleanup();
    await pgTest.users().cleanup();
  });

  const userData = createUserData({
    username: 'johndoe',
    password: 'p455w0rd',
  });

  describe('POST /authentications', () => {
    it('should response 201 and return auth data', async () => {
      const hashedPassword = await passwordHasher.hashPassword(
        userData.password,
      );
      await pgTest.users().add({ ...userData, password: hashedPassword });

      const expectedResBody = {
        status: 'success',
        data: {
          accessToken: expect.stringMatching(
            /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/,
          ),
          refreshToken: expect.stringMatching(
            /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/,
          ),
        },
      };

      const response = await serverTest
        .request()
        .post('/authentications')
        .send({ username: 'johndoe', password: 'p455w0rd' });

      expect(response.statusCode).toBe(201);
      expect(response.body).toStrictEqual(expectedResBody);

      const { accessToken, refreshToken } = response.body.data;
      expect(accessToken).not.toBe(refreshToken);
    });
  });

  describe('DELETE /authentications', () => {
    it('should response 200 and status "success"', async () => {
      const hashedPassword = await passwordHasher.hashPassword('p455w0rd');
      await pgTest.users().add({ ...userData, password: hashedPassword });

      const refreshToken = await authTokenService.createRefreshToken({
        id: userData.id,
        username: userData.username,
      });
      await pgTest
        .authentications()
        .add({ user_id: userData.id, token: refreshToken });

      const response = await serverTest
        .request()
        .delete('/authentications')
        .send({ refreshToken });

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({ status: 'success' });
    });
  });
});
