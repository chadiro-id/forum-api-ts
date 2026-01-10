import { AppModule } from '@main/app.module';
import { CommentId } from '@main/domain/entities/comment';
import { Reply, ReplyId } from '@main/domain/entities/reply';
import { ThreadId } from '@main/domain/entities/thread';
import { UserId } from '@main/domain/entities/user';
import { PG_POOL } from '@main/infrastructure/database/database.module';
import { PostgresReplyRepository } from '@main/infrastructure/persistence/repositories/postgres-reply.repository';
import Test from '@main/libs/my-app/testing/test-utils';
import { REPLY_REPOSITORY } from '@main/shared/injections.constant';
import {
  createCommentData,
  createReplyData,
  createThreadData,
  createUserData,
} from '@test/helper/data-factory';
import pgTest from '@test/helper/database/postgres-test.helper';
import { Pool } from 'pg';

let replyRepository: PostgresReplyRepository;

beforeAll(async () => {
  const moduleRef = Test.createTestingModule(AppModule);
  const pool: Pool = moduleRef.resolve(PG_POOL);

  replyRepository = moduleRef.resolve(REPLY_REPOSITORY);
  pgTest.setup(pool);

  await pgTest.truncate();
});

afterAll(async () => {
  await pgTest.truncate();
  await pgTest.end();
});

describe('PostgresReplyRepository', () => {
  const userData = createUserData();
  const threadData = createThreadData({ owner_id: userData.id });
  const commentData = createCommentData({
    thread_id: threadData.id,
    owner_id: userData.id,
  });
  const replyData = createReplyData({
    comment_id: commentData.id,
    owner_id: userData.id,
  });

  beforeAll(async () => {
    await pgTest.users().add(userData);
    await pgTest.threads().add(threadData);
    await pgTest.comments().add(commentData);
  });

  afterEach(async () => {
    await pgTest.replies().cleanup();
  });

  describe('add', () => {
    it('should persist Reply data', async () => {
      const id = new ReplyId('reply-004');
      const threadId = new ThreadId(threadData.id);
      const commentId = new CommentId(commentData.id);
      const ownerId = new UserId(userData.id);
      const content = 'Sebuah balasan';

      const reply = Reply.create(id, threadId, commentId, ownerId, content);
      await replyRepository.add(reply);

      const replyList = await pgTest.replies().findById('reply-004');
      expect(replyList).toStrictEqual([
        {
          id: reply.id.value,
          comment_id: reply.commentId.value,
          owner_id: reply.ownerId.value,
          content: reply.content,
          is_delete: reply.isDelete,
          created_at: reply.createdAt,
        },
      ]);
    });
  });

  describe('findById', () => {
    it('should return Reply entity', async () => {
      const data = await pgTest.replies().add({ ...replyData });

      const id = new ReplyId(data.id);
      const expectedReply = Reply.create(
        id,
        new ThreadId(threadData.id),
        new CommentId(data.comment_id),
        new UserId(data.owner_id),
        data.content,
        data.is_delete,
        data.created_at,
      );

      const reply = await replyRepository.findById(id);
      expect(reply).toStrictEqual(expectedReply);
    });

    it('should return null when not exists', async () => {
      const id = new ReplyId('non-existence-id');
      const reply = await replyRepository.findById(id);

      expect(reply).toBeNull();
    });
  });

  describe('softDelete', () => {
    it('should update delete status to TRUE', async () => {
      const data = await pgTest
        .replies()
        .add({ ...replyData, is_delete: false });

      const reply = Reply.create(
        new ReplyId(data.id),
        new ThreadId(commentData.thread_id),
        new CommentId(data.comment_id),
        new UserId(data.owner_id),
        data.content,
        data.is_delete,
        data.created_at,
      );

      await replyRepository.softDelete(reply);

      const replyList = await pgTest.replies().findById(data.id);
      expect(replyList).toStrictEqual([
        {
          id: reply.id.value,
          comment_id: reply.commentId.value,
          owner_id: reply.ownerId.value,
          content: reply.content,
          is_delete: true,
          created_at: reply.createdAt,
        },
      ]);
    });
  });
});
