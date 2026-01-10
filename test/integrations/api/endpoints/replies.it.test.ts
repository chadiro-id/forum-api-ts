import { AuthTokenService } from '@main/application/interfaces/auth-token-service.interface';
import { createServerTest, ServerTest } from '@test/helper/server-test.helper';
import pgTest from '@test/helper/database/postgres-test.helper';
import { AUTH_TOKEN_SERVICE } from '@main/shared/injections.constant';
import { Pool } from 'pg';
import { PG_POOL } from '@main/infrastructure/database/database.module';
import {
  createCommentData,
  createThreadData,
  createUserData,
} from '@test/helper/data-factory';

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

describe('Replies Endpoint', () => {
  const userData = createUserData();
  const threadData = createThreadData({ owner_id: userData.id });
  const commentData = createCommentData({
    thread_id: threadData.id,
    owner_id: userData.id,
  });

  beforeAll(async () => {
    await pgTest.users().add(userData);
    await pgTest.threads().add(threadData);
    await pgTest.comments().add(commentData);
  });

  afterAll(async () => {
    await pgTest.truncate();
  });

  describe('POST /threads/:threadId/comments/:commentId/replies', () => {
    const content = 'Sebuah balasan';

    let accessToken: string;
    beforeEach(async () => {
      accessToken = await authTokenService.createAccessToken({
        id: userData.id,
        username: userData.username,
      });
    });

    it('should response 201 and added reply data', async () => {
      const expectedResBody = {
        status: 'success',
        data: {
          addedReply: {
            id: expect.stringMatching(''),
            content,
            owner: userData.id,
          },
        },
      };

      const endpoint = `/threads/${threadData.id}/comments/${commentData.id}/replies`;
      const response = await serverTest
        .request()
        .post(endpoint)
        .auth(accessToken, { type: 'bearer' })
        .send({ content });

      expect(response.statusCode).toBe(201);
      expect(response.body).toStrictEqual(expectedResBody);
    });

    it('should response 401 when request with no authentication', async () => {
      const endpoint = `/threads/${threadData.id}/comments/${commentData.id}/replies`;
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
      const endpoint = `/threads/xxx/comments/${commentData.id}/replies`;
      const response = await serverTest
        .request()
        .post(endpoint)
        .auth(accessToken, { type: 'bearer' })
        .send({ content });

      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: 'komentar tidak ditemukan',
      });
    });

    it('should response 404 when comment not exists', async () => {
      const endpoint = `/threads/${threadData.id}/comments/xxx/replies`;
      const response = await serverTest
        .request()
        .post(endpoint)
        .auth(accessToken, { type: 'bearer' })
        .send({ content });

      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: 'komentar tidak ditemukan',
      });
    });

    it('should response 400 when payload missing content', async () => {
      const endpoint = `/threads/${threadData.id}/comments/${commentData.id}/replies`;
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
      const endpoint = `/threads/${threadData.id}/comments/${commentData.id}/replies`;
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
