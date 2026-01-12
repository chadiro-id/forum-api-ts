import { CommentId } from '../../../domain/comments/comment';
import { ReplyId } from '../../../domain/replies/reply';
import { ThreadId } from '../../../domain/threads/thread';
import { UserId } from '../../../domain/users/user';

export class DeleteReplyCommand {
  public readonly id: ReplyId;
  public readonly commentId: CommentId;
  public readonly threadId: ThreadId;
  public readonly userId: UserId;

  constructor(id: string, commentId: string, threadId: string, userId: string) {
    this.id = new ReplyId(id);
    this.commentId = new CommentId(commentId);
    this.threadId = new ThreadId(threadId);
    this.userId = new UserId(userId);
  }
}
