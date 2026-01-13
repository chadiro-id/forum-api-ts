import { ApplicationError } from '@main/application/common/errors/application-error';
import { ThreadId } from '../../../domain/threads/thread';
import { UserId } from '../../../domain/users/entities/user';

export class AddCommentCommand {
  public readonly threadId: ThreadId;
  public readonly userId: UserId;
  public readonly content: string;

  constructor(threadId: string, userId: string, content: string) {
    this.threadId = new ThreadId(threadId);
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
