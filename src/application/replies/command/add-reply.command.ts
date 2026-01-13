import { ApplicationError } from '@main/application/common/errors/application-error';
import { CommentId } from '../../../domain/comments/entities/comment';
import { ThreadId } from '../../../domain/threads/entities/thread';
import { UserId } from '../../../domain/users/entities/user';

export class AddReplyCommand {
  public readonly threadId: ThreadId;
  public readonly commentId: CommentId;
  public readonly userId: UserId;
  public readonly content: string;

  constructor(
    threadId: string,
    commentId: string,
    userId: string,
    content: string,
  ) {
    this.threadId = new ThreadId(threadId);
    this.commentId = new CommentId(commentId);
    this.userId = new UserId(userId);
    this.content = this.validateContent(content);
  }

  private validateContent(value: unknown): string {
    if (!value || typeof value !== 'string') {
      throw new ApplicationError('content cannot be empty', 'ARGUMENT_ERROR');
    }
    return value;
  }
}
