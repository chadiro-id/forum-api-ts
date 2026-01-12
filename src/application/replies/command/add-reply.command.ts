import { CommentId } from '../../../domain/comments/comment';
import { ThreadId } from '../../../domain/threads/thread';
import { UserId } from '../../../domain/users/user';

export class AddReplyCommand {
  constructor(
    public readonly threadId: ThreadId,
    public readonly commentId: CommentId,
    public readonly userId: UserId,
    public readonly content: string,
  ) {}
}
