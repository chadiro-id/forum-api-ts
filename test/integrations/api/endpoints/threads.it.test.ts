import { AuthTokenService } from '@main/application/common/interfaces/auth-token-service.interface';
import { PG_POOL } from '@main/infrastructure/database/database.module';
import { AUTH_TOKEN_SERVICE } from '@main/shared/injections.constant';
import {
  createCommentData,
  createReplyData,
  createThreadData,
  createUserData,
} from '@test/helper/data-factory';
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

  describe('GET /threads/:threadId', () => {
    const threadData = createThreadData({ owner_id: userData.id });
    const commentData = createCommentData({ thread_id: threadData.id });
    const replyData = createReplyData();

    beforeAll(async () => {
      await pgTest.threads().add(threadData);
    });

    afterAll(async () => {
      await pgTest.threads().cleanup();
    });

    afterEach(async () => {
      await pgTest.comments().cleanup();
      await pgTest.replies().cleanup();
    });

    it('should response 200 and thread details data', async () => {
      const expectedResBody = {
        status: 'success',
        data: {
          thread: {
            id: threadData.id,
            title: threadData.title,
            body: threadData.body,
            username: userData.username,
            date: expect.stringMatching(
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/,
            ),
            comments: [],
          },
        },
      };

      const response = await serverTest
        .request()
        .get(`/threads/${threadData.id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(expectedResBody);
    });

    it('should handle all comments inculding soft-deleted ones', async () => {
      const commentA = await pgTest
        .comments()
        .add({ ...commentData, id: 'comment-001', is_delete: false });
      const commentB = await pgTest
        .comments()
        .add({ ...commentData, id: 'comment-002', is_delete: true });
      await pgTest
        .commentLikes()
        .add({ comment_id: commentA.id, user_id: commentA.owner_id });

      const response = await serverTest
        .request()
        .get(`/threads/${threadData.id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.thread.comments).toStrictEqual([
        {
          id: commentA.id,
          content: commentA.content,
          date: commentA.created_at.toISOString(),
          username: userData.username,
          likeCount: 1,
          replies: [],
        },
        {
          id: commentB.id,
          content: '**komentar telah dihapus**',
          date: commentB.created_at.toISOString(),
          username: userData.username,
          likeCount: 0,
          replies: [],
        },
      ]);
    });

    it('should handle all replies including soft-deleted ones', async () => {
      const comment = await pgTest.comments().add({ ...commentData });
      const replyA = await pgTest.replies().add({
        ...replyData,
        id: 'reply-001',
        comment_id: comment.id,
        is_delete: false,
      });
      const replyB = await pgTest.replies().add({
        ...replyData,
        id: 'reply-002',
        comment_id: comment.id,
        is_delete: true,
      });

      const response = await serverTest
        .request()
        .get(`/threads/${threadData.id}`);

      expect(response.statusCode).toBe(200);

      const replies = response.body.data.thread.comments[0].replies;
      expect(replies).toStrictEqual([
        {
          id: replyA.id,
          content: replyA.content,
          date: replyA.created_at.toISOString(),
          username: userData.username,
        },
        {
          id: replyB.id,
          content: '**balasan telah dihapus**',
          date: replyB.created_at.toISOString(),
          username: userData.username,
        },
      ]);
    });

    it('should response 404 when thread not exists', async () => {
      const response = await serverTest.request().get('/threads/xxx');

      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: 'thread tidak ditemukan',
      });
    });
  });
});
