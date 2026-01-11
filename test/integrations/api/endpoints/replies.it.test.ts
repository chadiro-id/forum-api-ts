import { AuthTokenService } from '@main/application/common/interfaces/auth-token-service.interface';
import { createServerTest, ServerTest } from '@test/helper/server-test.helper';
import pgTest from '@test/helper/database/postgres-test.helper';
import { AUTH_TOKEN_SERVICE } from '@main/shared/injections.constant';
import { Pool } from 'pg';
import { PG_POOL } from '@main/infrastructure/database/database.module';
import {
  createCommentData,
  createReplyData,
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

    afterAll(async () => {
      await pgTest.replies().cleanup();
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

  describe('DELETE /threads/:threadId/comments/:commentId/replies/:replyId', () => {
    const replyData = createReplyData({
      comment_id: commentData.id,
      owner_id: userData.id,
    });

    beforeAll(async () => {
      await pgTest.replies().add(replyData);
    });

    afterAll(async () => {
      await pgTest.replies().cleanup();
    });

    let accessToken: string;
    beforeEach(async () => {
      accessToken = await authTokenService.createAccessToken({
        id: userData.id,
        username: userData.username,
      });
    });

    it('should response 200 and status "success"', async () => {
      const endpoint = `/threads/${threadData.id}/comments/${commentData.id}/replies/${replyData.id}`;
      const response = await serverTest
        .request()
        .delete(endpoint)
        .auth(accessToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({ status: 'success' });
    });

    it('should response 401 when request with no authentication', async () => {
      const endpoint = `/threads/${threadData.id}/comments/${commentData.id}/replies/${replyData.id}`;
      const response = await serverTest.request().delete(endpoint);

      expect(response.statusCode).toBe(401);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: 'Missing authentication',
      });
    });

    it('should response 403 when request id not authorized', async () => {
      const notAuthorizedToken = await authTokenService.createAccessToken({
        id: 'not-authorized-id',
        username: 'unknown-username',
      });

      const endpoint = `/threads/${threadData.id}/comments/${commentData.id}/replies/${replyData.id}`;
      const response = await serverTest
        .request()
        .delete(endpoint)
        .auth(notAuthorizedToken, { type: 'bearer' });

      expect(response.statusCode).toBe(403);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: 'pengguna tidak memiliki hak akses',
      });
    });

    it('should response 404 when reply not exists', async () => {
      const endpoint = `/threads/${threadData.id}/comments/${commentData.id}/replies/xxx`;
      const response = await serverTest
        .request()
        .delete(endpoint)
        .auth(accessToken, { type: 'bearer' });

      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: 'balasan tidak ditemukan',
      });
    });

    it('should response 400 when reply not belong to comment', async () => {
      const endpoint = `/threads/${threadData.id}/comments/another-comment-id/replies/${replyData.id}`;
      const response = await serverTest
        .request()
        .delete(endpoint)
        .auth(accessToken, { type: 'bearer' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: 'gagal mengakses sumber daya',
      });
    });
  });
});
