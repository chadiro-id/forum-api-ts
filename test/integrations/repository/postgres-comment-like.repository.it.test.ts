import { CommentId } from '@main/domain/comments/entities/comment';
import {
  CommentLike,
  CommentLikeId,
} from '@main/domain/comments/entities/comment-like';
import { UserId } from '@main/domain/users/entities/user';
import { ConfigModule } from '@main/infrastructure/config/config.module';
import {
  DatabaseModule,
  PG_POOL,
} from '@main/infrastructure/database/database.module';
import { PostgresCommentLikeRepository } from '@main/infrastructure/persistence/repositories/postgres-comment-like.repository';
import Test from '@main/libs/my-app/testing/test-utils';
import {
  createCommentData,
  createThreadData,
  createUserData,
} from '@test/helper/data-factory';
import pgTest from '@test/helper/database/postgres-test.helper';
import { Pool } from 'pg';

let commentLikeRepo: PostgresCommentLikeRepository;

beforeAll(async () => {
  const moduleRef = Test.createTestingModule({
    providers: [
      {
        provide: PostgresCommentLikeRepository,
        useClass: PostgresCommentLikeRepository,
      },
    ],
    imports: [ConfigModule, DatabaseModule],
  });
  const pool: Pool = moduleRef.resolve(PG_POOL);

  commentLikeRepo = moduleRef.resolve(PostgresCommentLikeRepository);
  pgTest.setup(pool);

  await pgTest.truncate();
});

afterAll(async () => {
  await pgTest.truncate();
  await pgTest.end();
});

describe('PostgresCommentLikeRepository', () => {
  const userData = createUserData({ id: 'user-001' });
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

  afterEach(async () => {
    await pgTest.commentLikes().cleanup();
  });

  describe('add', () => {
    it('should persits CommentLike data and return CommentLikeId', async () => {
      const entity = CommentLike.create(
        new CommentId(commentData.id),
        new UserId(userData.id),
      );

      const id = await commentLikeRepo.add(entity);
      expect(id).toBeInstanceOf(CommentLikeId);
      expect(id.value > 0).toBe(true);

      const persists = await pgTest.commentLikes().findById(id.value);
      expect(persists).toStrictEqual([
        {
          id: id.value,
          comment_id: entity.commentId.value,
          user_id: entity.userId.value,
        },
      ]);
    });
  });

  describe('find', () => {
    it('should return CommentLike entity', async () => {
      const data = await pgTest
        .commentLikes()
        .add({ comment_id: commentData.id, user_id: userData.id });
      const commentId = new CommentId(data.comment_id);
      const userId = new UserId(data.user_id);

      const commentLike = await commentLikeRepo.find({ commentId, userId });
      expect(commentLike).toStrictEqual(
        CommentLike.restore(
          new CommentLikeId(parseInt(data.id)),
          commentId,
          userId,
        ),
      );
    });

    it('should return null when not exists', async () => {
      const id = new CommentLikeId(1);

      const found = await commentLikeRepo.find({ id });
      expect(found).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete comment like data', async () => {
      const data = await pgTest
        .commentLikes()
        .add({ comment_id: commentData.id, user_id: userData.id });

      const entity = CommentLike.restore(
        new CommentLikeId(parseInt(data.id)),
        new CommentId(data.comment_id),
        new UserId(data.user_id),
      );

      await commentLikeRepo.delete(entity);

      const commentLikeList = await pgTest
        .commentLikes()
        .findById(entity.id.value);

      expect(commentLikeList).toStrictEqual([]);
    });
  });
});
