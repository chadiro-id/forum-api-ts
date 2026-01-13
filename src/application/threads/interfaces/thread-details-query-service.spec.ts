import { CommentId } from '@main/domain/comments/entities/comment';
import { ThreadId } from '@main/domain/threads/entities/thread';
import {
  ThreadDetails,
  CommentDetails,
  ReplyDetails,
} from '../query/results/thread-details.result';
import { ThreadDetailsQueryService } from './thread-details-query-service.interface';

export class MockThreadDetailsQueryService implements ThreadDetailsQueryService {
  private threadDetailsList: Array<ThreadDetails> = [];
  private commentDetailsList: Array<CommentDetails> = [];
  private replyDetailsList: Array<ReplyDetails> = [];

  async getById(id: ThreadId): Promise<ThreadDetails | null> {
    const item = this.threadDetailsList.find((t) => t.id.equals(id));
    return item ?? null;
  }

  async getCommentsById(id: ThreadId): Promise<CommentDetails[]> {
    const comments = this.commentDetailsList.filter((c) => c.id.equals(id));
    return comments;
  }

  async getRepliesByCommentIds(ids: CommentId[]): Promise<ReplyDetails[]> {
    const valueIds = ids.map((id) => id.value);
    const replies = this.replyDetailsList.filter((r) =>
      valueIds.includes(r.commentId.value),
    );
    return replies;
  }
}

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
