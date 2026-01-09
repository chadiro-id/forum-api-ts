import { CommentId } from '../../../domain/entities/comment';
import { ThreadId } from '../../../domain/entities/thread';
import { UserId } from '../../../domain/entities/user';

export class DeleteCommentCommand {
  constructor(
    public readonly id: CommentId,
    public readonly threadId: ThreadId,
    public readonly userId: UserId,
  ) {}
}
