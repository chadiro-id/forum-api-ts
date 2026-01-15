import { CommentId } from '@main/domain/comments/entities/comment';
import { ThreadId } from '@main/domain/threads/entities/thread';
import { UserId } from '@main/domain/users/entities/user';

export class LikeCommentCommand {
  public readonly id: CommentId;
  public readonly threadId: ThreadId;
  public readonly userId: UserId;

  constructor(id: string, threadId: string, userId: string) {
    this.id = new CommentId(id);
    this.threadId = new ThreadId(threadId);
    this.userId = new UserId(userId);
  }
}
