import { createServerTest, ServerTest } from '@test/helper/server-test.helper';
import pgTest from '@test/helper/database/postgres-test.helper';
import { PG_POOL } from '@main/infrastructure/database/database.module';
import { Pool } from 'pg';
import { AuthTokenService } from '@main/application/common/interfaces/auth-token-service.interface';
import { PasswordHasher } from '@main/application/common/interfaces/password-hasher.interface';
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
    it('should response 201 and auth token data', async () => {
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

    it('should response 400 when user not exists', async () => {
      const payload = { username: 'non-existence-user', password: 'p455w0rd' };
      const response = await serverTest
        .request()
        .post('/authentications')
        .send(payload);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: 'pengguna tidak ada',
      });
    });

    it('should response 401 when password is not match', async () => {
      const hashedPassword = await passwordHasher.hashPassword('p455w0rd');
      await pgTest.users().add({ ...userData, password: hashedPassword });

      const payload = { username: userData.username, password: 'p455word' };
      const response = await serverTest
        .request()
        .post('/authentications')
        .send(payload);

      expect(response.statusCode).toBe(401);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: 'kredensial yang anda masukkan salah',
      });
    });

    it('should response 400 when password not string', async () => {
      const payload = { username: 'johndoe', password: 12345 };
      const response = await serverTest
        .request()
        .post('/authentications')
        .send(payload);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: '"password" harus berupa teks',
      });
    });

    it('should response 400 when payload missing password', async () => {
      const payload = { username: userData.username };
      const response = await serverTest
        .request()
        .post('/authentications')
        .send(payload);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: '"password" wajib diisi',
      });
    });
  });

  describe('PUT /authentications', () => {
    it('should response 200 and new access token', async () => {
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
        .put('/authentications')
        .send({ refreshToken });

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({
        status: 'success',
        data: {
          accessToken: expect.stringMatching(
            /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/,
          ),
        },
      });
    });

    it('should response 400 when payload missing refreshToken', async () => {
      const payload = { refreshTokens: 'typo key' };
      const response = await serverTest
        .request()
        .put('/authentications')
        .send(payload);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: '"refreshToken" wajib diisi',
      });
    });

    it('should response 400 when refreshToken not string', async () => {
      const payload = { refreshToken: 12345 };
      const response = await serverTest
        .request()
        .put('/authentications')
        .send(payload);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: '"refreshToken" harus berupa teks',
      });
    });

    it('should response 400 when refreshToken is invalid', async () => {
      const payload = { refreshToken: 'invalid_token' };
      const response = await serverTest
        .request()
        .put('/authentications')
        .send(payload);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: 'refresh token tidak valid',
      });
    });

    it('should response 400 when refreshToken not exists', async () => {
      const refreshToken = await authTokenService.createRefreshToken({
        id: 'user-001',
        username: 'johndoe',
      });

      const response = await serverTest
        .request()
        .put('/authentications')
        .send({ refreshToken });

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: 'refresh token tidak ditemukan di database',
      });
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

    it('should response 400 when payload missing refreshToken', async () => {
      const payload = { refreshTokens: 'typo key' };
      const response = await serverTest
        .request()
        .delete('/authentications')
        .send(payload);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: '"refreshToken" wajib diisi',
      });
    });

    it('should response 400 when refreshToken not string', async () => {
      const payload = { refreshToken: 12345 };
      const response = await serverTest
        .request()
        .delete('/authentications')
        .send(payload);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: '"refreshToken" harus berupa teks',
      });
    });

    it('should response 400 when refreshToken not exists', async () => {
      const refreshToken = await authTokenService.createRefreshToken({
        id: 'user-001',
        username: 'johndoe',
      });

      const response = await serverTest
        .request()
        .delete('/authentications')
        .send({ refreshToken });

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: 'refresh token tidak ditemukan di database',
      });
    });
  });
});
