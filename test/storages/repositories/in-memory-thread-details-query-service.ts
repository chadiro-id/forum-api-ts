import {
  ThreadDetails,
  CommentDetails,
  ReplyDetails,
} from '@main/application/threads/query/results/thread-details.result';
import { Comment, CommentId } from '@main/domain/comments/entities/comment';
import { Thread, ThreadId } from '@main/domain/threads/entities/thread';
import { ThreadDetailsQueryService } from '../../../src/application/threads/interfaces/thread-details-query-service.interface';
import { FakeStorage } from '../../../src/application/common/tests/data/fake-storage-utils';
import { User } from '@main/domain/users/entities/user';
import { Reply } from '@main/domain/replies/entities/reply';

export class InMemoryThreadDetailsQueryService implements ThreadDetailsQueryService {
  private userList: Array<User>;
  private threadList: Array<Thread>;
  private commentList: Array<Comment>;
  private replyList: Array<Reply>;

  constructor(private storage: FakeStorage = new Map()) {
    this.userList = this.storage.get('users')! as User[];
    this.threadList = (this.storage.get('threads') as Thread[]) || [];
    this.commentList = (this.storage.get('comments') as Comment[]) || [];
    this.replyList = (this.storage.get('replies') as Reply[]) || [];
  }

  async getById(id: ThreadId): Promise<ThreadDetails | null> {
    const thread = this.threadList.find((t) => t.id.equals(id));
    if (!thread) return null;

    const user = this.userList.find((u) => u.id.equals(thread.ownerId));

    return new ThreadDetails(
      thread.id,
      thread.title,
      thread.body,
      user!.username,
      thread.createdAt,
    );
  }

  async getCommentsById(id: ThreadId): Promise<CommentDetails[]> {
    const comments = this.commentList.filter((c) => c.threadId.equals(id));

    return comments.map((c) => {
      const user = this.userList.find((u) => u.id.equals(c.ownerId));
      return new CommentDetails(
        c.id,
        c.content,
        user!.username,
        c.isDelete,
        c.createdAt,
      );
    });
  }

  async getRepliesByCommentIds(ids: CommentId[]): Promise<ReplyDetails[]> {
    const mappedIds = ids.map((id) => id.value);
    const replies = this.replyList.filter((r) =>
      mappedIds.includes(r.commentId.value),
    );

    return replies.map((r) => {
      const user = this.userList.find((u) => u.id.equals(r.ownerId));
      return new ReplyDetails(
        r.id,
        r.commentId,
        user!.username,
        r.content,
        r.isDelete,
        r.createdAt,
      );
    });
  }
}
