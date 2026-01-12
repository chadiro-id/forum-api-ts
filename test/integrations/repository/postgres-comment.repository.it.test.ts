import { AppModule } from '@main/app.module';
import { Comment, CommentId } from '@main/domain/comments/comment';
import { ThreadId } from '@main/domain/threads/thread';
import { UserId } from '@main/domain/users/user';
import { PG_POOL } from '@main/infrastructure/database/database.module';
import { CommentMapper } from '@main/infrastructure/persistence/mappers/comment.mapper';
import { PostgresCommentRepository } from '@main/infrastructure/persistence/repositories/postgres-comment.repository';
import Test from '@main/libs/my-app/testing/test-utils';
import { COMMENT_REPOSITORY } from '@main/shared/injections.constant';
import {
  createCommentData,
  createThreadData,
  createUserData,
} from '@test/helper/data-factory';
import pgTest from '@test/helper/database/postgres-test.helper';
import { Pool } from 'pg';

let commentRepository: PostgresCommentRepository;

beforeAll(async () => {
  const moduleRef = Test.createTestingModule(AppModule);
  const pool: Pool = moduleRef.resolve(PG_POOL);

  commentRepository = moduleRef.resolve(COMMENT_REPOSITORY);

  pgTest.setup(pool);
  await pgTest.truncate();
});

afterAll(async () => {
  await pgTest.truncate();
  await pgTest.end();
});

describe('PostgresCommentRepository', () => {
  const userData = createUserData();
  const threadData = createThreadData({ owner_id: userData.id });

  beforeAll(async () => {
    await pgTest.users().add(userData);
    await pgTest.threads().add(threadData);
  });

  afterEach(async () => {
    await pgTest.comments().cleanup();
  });

  describe('add', () => {
    it('should persist Comment data', async () => {
      const id = new CommentId('comment-003');
      const threadId = new ThreadId(threadData.id);
      const ownerId = new UserId(userData.id);

      const comment = Comment.create(id, threadId, ownerId, 'Sebuah komentar');
      await commentRepository.add(comment);

      const commentList = await pgTest.comments().findById('comment-003');
      expect(commentList).toStrictEqual([
        {
          id: comment.id.value,
          thread_id: comment.threadId.value,
          owner_id: comment.ownerId.value,
          content: comment.content,
          is_delete: false,
          created_at: comment.createdAt,
        },
      ]);
    });
  });

  describe('findById', () => {
    it('should return Comment entity', async () => {
      const commentData = createCommentData({
        thread_id: threadData.id,
        owner_id: userData.id,
      });
      await pgTest.comments().add(commentData);

      const expectedComment = CommentMapper.toDomain(commentData);

      const id = new CommentId(commentData.id);
      const comment = await commentRepository.findById(id);

      expect(comment).toStrictEqual(expectedComment);
    });

    it('should return null when not exists', async () => {
      const id = new CommentId('non-exist-id');
      const comment = await commentRepository.findById(id);

      expect(comment).toBeNull();
    });
  });

  describe('existsBy', () => {
    it('should return true when criteria match', async () => {
      const data = createCommentData({
        thread_id: threadData.id,
        owner_id: userData.id,
      });
      await pgTest.comments().add(data);

      const id = new CommentId(data.id);
      const threadId = new ThreadId(data.thread_id);

      const exists = await commentRepository.existsBy({ id, threadId });
      expect(exists).toBe(true);
    });

    it('should return false when criteria not match', async () => {
      const id = new CommentId('non-existence-id');

      const exists = await commentRepository.existsBy({ id });
      expect(exists).toBe(false);
    });
  });

  describe('softDelete', () => {
    it('should update delete status to TRUE', async () => {
      const data = createCommentData({
        thread_id: threadData.id,
        owner_id: userData.id,
      });
      await pgTest.comments().add(data);

      const comment = CommentMapper.toDomain(data);
      await commentRepository.softDelete(comment);

      const commentList = await pgTest.comments().findById(data.id);
      expect(commentList).toStrictEqual([
        {
          id: comment.id.value,
          thread_id: comment.threadId.value,
          owner_id: comment.ownerId.value,
          content: comment.content,
          is_delete: true,
          created_at: comment.createdAt,
        },
      ]);
    });
  });
});
