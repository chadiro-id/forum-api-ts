import { CommentId } from '@main/domain/comments/entities/comment';
import { ThreadId } from '@main/domain/threads/entities/thread';
import {
  ThreadDetails,
  CommentDetails,
  ReplyDetails,
} from '../query/results/thread-details.result';
import { ThreadDetailsQueryService } from './thread-details-query-service.interface';

export class MockThreadDetailsQueryService implements ThreadDetailsQueryService {
  private threadDetailsList: Array<ThreadDetails>;
  private commentDetailsList: Array<CommentDetails>;
  private replyDetailsList: Array<ReplyDetails>;

  constructor(private storage: Map<string, any[]> = new Map()) {
    this.threadDetailsList = this.storage.get('threads') || [];
    this.commentDetailsList = this.storage.get('comments') || [];
    this.replyDetailsList = this.storage.get('replies') || [];
  }

  async getById(id: ThreadId): Promise<ThreadDetails | null> {
    const item = this.threadDetailsList.find((t) => t.id.equals(id));
    return item ?? null;
  }

  async getCommentsById(id: ThreadId): Promise<CommentDetails[]> {
    const comments = this.commentDetailsList.filter((c) =>
      c.threadId.equals(id),
    );
    return comments;
  }

  async getRepliesByCommentIds(ids: CommentId[]): Promise<ReplyDetails[]> {
    const replies = this.replyDetailsList.filter((r) =>
      ids.some((id) => id.equals(r.commentId)),
    );
    return replies;
  }
}
