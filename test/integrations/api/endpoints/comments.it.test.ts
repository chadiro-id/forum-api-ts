import { createServerTest, ServerTest } from '@test/helper/server-test.helper';
import pgTest from '@test/helper/database/postgres-test.helper';
import { Pool } from 'pg';
import { PG_POOL } from '@main/infrastructure/database/database.module';
import { AuthTokenService } from '@main/application/interfaces/auth-token-service.interface';
import { AUTH_TOKEN_SERVICE } from '@main/shared/injections.constant';
import { createThreadData, createUserData } from '@test/helper/data-factory';

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

describe('Comments Endpoint', () => {
  const userData = createUserData();
  const threadData = createThreadData({ owner_id: userData.id });

  beforeAll(async () => {
    await pgTest.users().add(userData);
    await pgTest.threads().add(threadData);
  });

  afterAll(async () => {
    await pgTest.users().cleanup();
    await pgTest.threads().cleanup();
  });

  describe('POST /threads/:threadId/comments', () => {
    const content = 'Sebuah komentar';

    let accessToken: string;
    beforeEach(async () => {
      accessToken = await authTokenService.createAccessToken({
        id: userData.id,
        username: userData.username,
      });
    });

    it('should response 201 and added comment data', async () => {
      const expectedResBody = {
        status: 'success',
        data: {
          addedComment: {
            id: expect.stringMatching(/^[A-Za-z0-9_-]{21}$/),
            content: 'Sebuah komentar',
            owner: userData.id,
          },
        },
      };

      const endpoint = `/threads/${threadData.id}/comments`;
      const response = await serverTest
        .request()
        .post(endpoint)
        .auth(accessToken, { type: 'bearer' })
        .send({ content });

      expect(response.statusCode).toBe(201);
      expect(response.body).toStrictEqual(expectedResBody);
    });

    it('should response 401 when request with no authentication', async () => {
      const endpoint = `/threads/${threadData.id}/comments`;
      const response = await serverTest
        .request()
        .post(endpoint)
        .send({ content });

      expect(response.statusCode).toBe(401);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: 'Missing authentication',
      });
    });

    it('should response 404 when thread not exists', async () => {
      const response = await serverTest
        .request()
        .post('/threads/xxx/comments')
        .auth(accessToken, { type: 'bearer' })
        .send({ content });

      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: 'thread tidak ditemukan',
      });
    });

    it('should response 400 when payload missing content', async () => {
      const endpoint = `/threads/${threadData.id}/comments`;
      const response = await serverTest
        .request()
        .post(endpoint)
        .auth(accessToken, { type: 'bearer' })
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: '"content" wajib diisi',
      });
    });

    it('should response 400 when content not string', async () => {
      const endpoint = `/threads/${threadData.id}/comments`;
      const response = await serverTest
        .request()
        .post(endpoint)
        .auth(accessToken, { type: 'bearer' })
        .send({ content: 1234 });

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: '"content" harus berupa teks',
      });
    });
  });
});
