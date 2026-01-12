import { CommentId } from '../../../domain/comments/comment';
import { ThreadId } from '../../../domain/threads/thread';
import { UserId } from '../../../domain/entities/user';

export class DeleteCommentCommand {
  constructor(
    public readonly id: CommentId,
    public readonly threadId: ThreadId,
    public readonly userId: UserId,
  ) {}
}
