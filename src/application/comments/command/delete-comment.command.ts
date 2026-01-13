import { CommentId } from '../../../domain/comments/comment';
import { ThreadId } from '../../../domain/threads/thread';
import { UserId } from '../../../domain/users/entities/user';

export class DeleteCommentCommand {
  public readonly id: CommentId;
  public readonly threadId: ThreadId;
  public readonly userId: UserId;

  constructor(id: string, threadId: string, userId: string) {
    this.id = new CommentId(id);
    this.threadId = new ThreadId(threadId);
    this.userId = new UserId(userId);
  }
}
