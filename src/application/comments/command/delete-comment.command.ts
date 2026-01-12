import { CommentId } from '../../../domain/comments/comment';
import { ThreadId } from '../../../domain/threads/thread';
import { UserId } from '../../../domain/users/user';

export class DeleteCommentCommand {
  constructor(
    public readonly id: CommentId,
    public readonly threadId: ThreadId,
    public readonly userId: UserId,
  ) {}
}
