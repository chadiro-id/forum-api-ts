import { CommentId } from '@main/domain/comments/entities/comment';
import { ThreadId } from '@main/domain/threads/entities/thread';
import { MockThreadDetailsQueryService } from './thread-details-query-service.mock';
import {
  CommentDetails,
  ReplyDetails,
  ThreadDetails,
} from '../query/results/thread-details.result';
import { ReplyId } from '@main/domain/replies/entities/reply';

describe('ThreadDetailsQueryService', () => {
  it('should enforce getById method', async () => {
    const storage = new Map<string, any[]>();
    const threadDetails = new ThreadDetails(
      new ThreadId('thread-id'),
      'title',
      'body',
      'username',
      new Date(),
    );
    storage.set('threads', [threadDetails]);
    const qs = new MockThreadDetailsQueryService(storage);

    const nonExistThread = await qs.getById(new ThreadId('thread-xxx'));
    expect(nonExistThread).toBeNull();

    const thread = await qs.getById(new ThreadId('thread-id'));
    expect(thread).toStrictEqual(threadDetails);
  });

  it('should enforce getCommentsByIds method', async () => {
    const storage = new Map<string, any[]>();
    const commentDetails = new CommentDetails(
      new CommentId('comment-id'),
      new ThreadId('thread-id'),
      'Sebuah komentar',
      'johndoe',
      false,
      1,
      new Date(),
    );
    storage.set('comments', [commentDetails]);

    const qs = new MockThreadDetailsQueryService(storage);

    const emptyComments = await qs.getCommentsById(new ThreadId('thread-xxx'));
    expect(emptyComments).toStrictEqual([]);

    const comments = await qs.getCommentsById(new ThreadId('thread-id'));
    expect(comments).toStrictEqual([commentDetails]);
  });

  it('should enforce getRepliesByCommentIds method', async () => {
    const storage = new Map<string, any[]>();
    const replyDetails = new ReplyDetails(
      new ReplyId('reply-001'),
      new CommentId('comment-id'),
      'johndoe',
      'content',
      false,
      new Date(),
    );
    storage.set('replies', [replyDetails]);
    const qs = new MockThreadDetailsQueryService(storage);

    const emptyReplies = await qs.getRepliesByCommentIds([
      new CommentId('comment-xxx'),
    ]);
    expect(emptyReplies).toStrictEqual([]);

    const replies = await qs.getRepliesByCommentIds([
      new CommentId('comment-id'),
    ]);
    expect(replies).toStrictEqual([replyDetails]);
  });
});
