import { CommentId } from '@main/domain/comments/entities/comment';
import { ThreadId } from '@main/domain/threads/entities/thread';
import { MockThreadDetailsQueryService } from './thread-details-query-service.mock';
import { ReplyDetails } from '../query/results/thread-details.result';
import { ReplyId } from '@main/domain/replies/entities/reply';

describe('ThreadDetailsQueryService', () => {
  it('should enforce getById method', async () => {
    const qs = new MockThreadDetailsQueryService();

    const thread = await qs.getById(new ThreadId('thread-id'));
    expect(thread).toBeNull();
  });

  it('should enforce getCommentsByIds method', async () => {
    const qs = new MockThreadDetailsQueryService();

    const comments = await qs.getCommentsById(new ThreadId('thread-id'));
    expect(comments).toStrictEqual([]);
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
