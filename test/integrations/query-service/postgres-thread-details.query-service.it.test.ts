import {
  CommentDetails,
  ReplyDetails,
  ThreadDetails,
} from '@main/application/threads/query/results/thread-details.result';
import { CommentId } from '@main/domain/comments/entities/comment';
import { ReplyId } from '@main/domain/replies/entities/reply';
import { ThreadId } from '@main/domain/threads/entities/thread';
import { ConfigModule } from '@main/infrastructure/config/config.module';
import {
  DatabaseModule,
  PG_POOL,
} from '@main/infrastructure/database/database.module';
import { PostgresThreadDetailsQueryService } from '@main/infrastructure/persistence/query-services/postgres-thread-details.query-service';
import Test from '@main/libs/my-app/testing/test-utils';
import {
  createCommentData,
  createReplyData,
  createThreadData,
  createUserData,
} from '@test/helper/data-factory';
import pgTest from '@test/helper/database/postgres-test.helper';
import { Pool } from 'pg';

let threadDetailsQueryService: PostgresThreadDetailsQueryService;

beforeAll(async () => {
  const moduleRef = Test.createTestingModule({
    providers: [
      {
        provide: PostgresThreadDetailsQueryService,
        useClass: PostgresThreadDetailsQueryService,
      },
    ],
    imports: [ConfigModule, DatabaseModule],
  });
  const pool: Pool = moduleRef.resolve(PG_POOL);

  threadDetailsQueryService = moduleRef.resolve(
    PostgresThreadDetailsQueryService,
  );
  pgTest.setup(pool);

  await pgTest.truncate();
});

afterAll(async () => {
  await pgTest.truncate();
  await pgTest.end();
});

describe('PostgresThreadDetailsQueryService', () => {
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
  });

  afterEach(async () => {
    await pgTest.comments().cleanup();
    await pgTest.replies().cleanup();
  });

  describe('getById', () => {
    it('should return ThreadDetails', async () => {
      const id = new ThreadId(threadData.id);
      const expectedThreadDetails = new ThreadDetails(
        id,
        threadData.title,
        threadData.body,
        userData.username,
        threadData.created_at,
      );

      const thread = await threadDetailsQueryService.getById(id);
      expect(thread).toStrictEqual(expectedThreadDetails);
    });

    it('should return null when not exists', async () => {
      const id = new ThreadId('non-existence-thread-id');
      const thread = await threadDetailsQueryService.getById(id);

      expect(thread).toBeNull();
    });
  });

  describe('GetCommentsById', () => {
    it('should correctly return CommentDetails datas', async () => {
      const commentA = await pgTest
        .comments()
        .add({ ...commentData, id: 'comment-001' });
      const commentB = await pgTest
        .comments()
        .add({ ...commentData, id: 'comment-002' });
      await pgTest
        .commentLikes()
        .add({ comment_id: commentA.id, user_id: commentA.owner_id });

      const id = new ThreadId(threadData.id);
      const commentDetailsA = new CommentDetails(
        new CommentId(commentA.id),
        id,
        commentA.content,
        userData.username,
        commentA.is_delete,
        1,
        commentA.created_at,
      );
      const commentDetailsB = new CommentDetails(
        new CommentId(commentB.id),
        id,
        commentB.content,
        userData.username,
        commentB.is_delete,
        0,
        commentB.created_at,
      );

      const comments = await threadDetailsQueryService.getCommentsById(id);
      expect(comments).toStrictEqual([commentDetailsA, commentDetailsB]);
    });

    it('should return empty array when thread has no comments', async () => {
      const id = new ThreadId(threadData.id);
      const comments = await threadDetailsQueryService.getCommentsById(id);
      expect(comments).toStrictEqual([]);
    });
  });

  describe('GetRepliesByCommentIds', () => {
    it('should correctly return ReplyDetails datas', async () => {
      const comment = await pgTest.comments().add({ ...commentData });
      const replyA = await pgTest
        .replies()
        .add({ ...replyData, id: 'reply-001' });
      const replyB = await pgTest
        .replies()
        .add({ ...replyData, id: 'reply-002' });

      const commentId = new CommentId(comment.id);
      const replyDetailsA = new ReplyDetails(
        new ReplyId(replyA.id),
        commentId,
        userData.username,
        replyA.content,
        replyA.is_delete,
        replyA.created_at,
      );
      const replyDetailsB = new ReplyDetails(
        new ReplyId(replyB.id),
        commentId,
        userData.username,
        replyB.content,
        replyB.is_delete,
        replyB.created_at,
      );

      const replies = await threadDetailsQueryService.getRepliesByCommentIds([
        commentId,
      ]);
      expect(replies).toStrictEqual([replyDetailsA, replyDetailsB]);
    });

    it('should return empty array when comments has no replies', async () => {
      const comment = await pgTest.comments().add({ ...commentData });

      const commentId = new CommentId(comment.id);
      const replies = await threadDetailsQueryService.getRepliesByCommentIds([
        commentId,
      ]);

      expect(replies).toStrictEqual([]);
    });
  });
});
