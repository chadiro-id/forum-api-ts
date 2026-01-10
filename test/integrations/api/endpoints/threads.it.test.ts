import { AuthTokenService } from '@main/application/interfaces/auth-token-service.interface';
import { PG_POOL } from '@main/infrastructure/database/database.module';
import { AUTH_TOKEN_SERVICE } from '@main/shared/injections.constant';
import { createUserData } from '@test/helper/data-factory';
import pgTest from '@test/helper/database/postgres-test.helper';
import { createServerTest, ServerTest } from '@test/helper/server-test.helper';
import { Pool } from 'pg';

let serverTest: ServerTest;
let authTokenService: AuthTokenService;

beforeAll(async () => {
  serverTest = createServerTest();
  serverTest.init();

  authTokenService = serverTest.getResolvedInstance(AUTH_TOKEN_SERVICE);
  const pool: Pool = serverTest.getResolvedInstance(PG_POOL);
  pgTest.setup(pool);

  await pgTest.truncate();
});

afterAll(async () => {
  await pgTest.end();
});

describe('Threads Endpoint', () => {
  const userData = createUserData();

  beforeAll(async () => {
    await pgTest.users().add(userData);
  });

  afterAll(async () => {
    await pgTest.users().cleanup();
  });

  describe('POST /threads', () => {
    let accessToken: string;
    beforeEach(async () => {
      accessToken = await authTokenService.createAccessToken({
        id: userData.id,
        username: userData.username,
      });
    });

    afterAll(async () => {
      await pgTest.threads().cleanup();
    });

    it('should response 201 and added thread data', async () => {
      const expectedResBody = {
        status: 'success',
        data: {
          addedThread: {
            id: expect.stringMatching(/^[A-Za-z0-9_-]{21}$/),
            title: 'Sebuah thread',
            owner: userData.id,
          },
        },
      };

      const payload = { title: 'Sebuah thread', body: 'Isi thread' };
      const response = await serverTest
        .request()
        .post('/threads')
        .auth(accessToken, { type: 'bearer' })
        .send(payload);

      expect(response.statusCode).toBe(201);
      expect(response.body).toStrictEqual(expectedResBody);
    });

    it('should response 401 when request with no authentication', async () => {
      const payload = { title: 'Sebuah thread', body: 'Isi thread' };
      const response = await serverTest
        .request()
        .post('/threads')
        .send(payload);

      expect(response.statusCode).toBe(401);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: 'Missing authentication',
      });
    });

    it('should response 400 when payload missing title', async () => {
      const response = await serverTest
        .request()
        .post('/threads')
        .auth(accessToken, { type: 'bearer' })
        .send({ body: 'Isi thread' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: '"title" wajib diisi',
      });
    });

    it('should response 400 when title not string', async () => {
      const response = await serverTest
        .request()
        .post('/threads')
        .auth(accessToken, { type: 'bearer' })
        .send({ title: 123, body: 'Isi thread' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: '"title" harus berupa teks',
      });
    });

    it('should response 400 when title more than 255 character', async () => {
      const response = await serverTest
        .request()
        .post('/threads')
        .auth(accessToken, { type: 'bearer' })
        .send({ title: 'a'.repeat(256), body: 'Isi thread' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: '"title" maksimal 255 karakter',
      });
    });
  });
});
