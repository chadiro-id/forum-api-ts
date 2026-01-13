import { FakeStorage } from '../data/fake-storage-utils';
import {
  createUserEntity,
  createThreadEntity,
  createCommentEntity,
  createReplyEntity,
} from '../data/entity-factory';
import { InMemoryThreadDetailsQueryService } from './in-memory-thread-details-query-service';
import { ThreadId } from '@main/domain/threads/entities/thread';
import {
  CommentDetails,
  ReplyDetails,
  ThreadDetails,
} from '@main/application/threads/query/results/thread-details.result';

describe('InMemoryThreadDetailsQueryService', () => {
  const storage: FakeStorage = new Map();
  const userE = createUserEntity('user-001');
  const threadE = createThreadEntity('thread-001', userE.id.value);
  const commentE1 = createCommentEntity(
    'comment-001',
    threadE.id.value,
    userE.id.value,
  );
  const commentE2 = createCommentEntity(
    'comment-002',
    threadE.id.value,
    userE.id.value,
  );
  const replyE1 = createReplyEntity(
    'reply-001',
    threadE.id.value,
    commentE1.id.value,
    userE.id.value,
  );
  const replyE2 = createReplyEntity(
    'reply-002',
    threadE.id.value,
    commentE1.id.value,
    userE.id.value,
  );

  beforeAll(() => {
    storage
      .set('users', [userE])
      .set('threads', [threadE])
      .set('comments', [commentE1, commentE2])
      .set('replies', [replyE1, replyE2]);
  });

  describe('getById', () => {
    it('should return ThreadDetails', async () => {
      const expectedThread = new ThreadDetails(
        new ThreadId(threadE.id.value),
        threadE.title,
        threadE.body,
        userE.username,
        threadE.createdAt,
      );

      const qs = new InMemoryThreadDetailsQueryService(storage);
      const thread = await qs.getById(new ThreadId('thread-001'));

      expect(thread).toStrictEqual(expectedThread);
    });

    it('should return null', async () => {
      const qs = new InMemoryThreadDetailsQueryService(storage);
      const thread = await qs.getById(new ThreadId('thread-xxx'));

      expect(thread).toBeNull();
    });
  });

  describe('getCommentsById', () => {
    it('should return all comments', async () => {
      const qs = new InMemoryThreadDetailsQueryService(storage);
      const comments = await qs.getCommentsById(threadE.id);

      expect(comments).toStrictEqual([
        new CommentDetails(
          commentE1.id,
          commentE1.content,
          userE.username,
          commentE1.isDelete,
          commentE1.createdAt,
        ),
        new CommentDetails(
          commentE2.id,
          commentE2.content,
          userE.username,
          commentE2.isDelete,
          commentE2.createdAt,
        ),
      ]);
    });
  });

  describe('getRepliesByCommentIds', () => {
    it('should return all replies', async () => {
      const qs = new InMemoryThreadDetailsQueryService(storage);
      const replies = await qs.getRepliesByCommentIds([
        commentE1.id,
        commentE2.id,
      ]);

      expect(replies).toStrictEqual([
        new ReplyDetails(
          replyE1.id,
          replyE1.commentId,
          userE.username,
          replyE1.content,
          replyE1.isDelete,
          replyE1.createdAt,
        ),
        new ReplyDetails(
          replyE2.id,
          replyE2.commentId,
          userE.username,
          replyE2.content,
          replyE2.isDelete,
          replyE2.createdAt,
        ),
      ]);
    });
  });
});
