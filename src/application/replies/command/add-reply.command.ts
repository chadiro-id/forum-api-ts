import { CommentId } from '../../../domain/entities/comment';
import { ThreadId } from '../../../domain/entities/thread';
import { UserId } from '../../../domain/entities/user';

export class AddReplyCommand {
  constructor(
    public readonly threadId: ThreadId,
    public readonly commentId: CommentId,
    public readonly userId: UserId,
    public readonly content: string,
  ) {}
}
