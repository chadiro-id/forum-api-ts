import { CommentId } from '@main/domain/comments/entities/comment';
import { ThreadId } from '@main/domain/threads/entities/thread';
import { MockThreadDetailsQueryService } from './thread-details-query-service.mock';

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
    const qs = new MockThreadDetailsQueryService();

    const replies = await qs.getRepliesByCommentIds([
      new CommentId('comment-id'),
    ]);
    expect(replies).toStrictEqual([]);
  });
});
