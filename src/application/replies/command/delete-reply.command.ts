import { CommentId } from '../../../domain/comments/comment';
import { ReplyId } from '../../../domain/replies/reply';
import { ThreadId } from '../../../domain/threads/thread';
import { UserId } from '../../../domain/users/user';

export class DeleteReplyCommand {
  constructor(
    public readonly id: ReplyId,
    public readonly commentId: CommentId,
    public readonly threadId: ThreadId,
    public readonly userId: UserId,
  ) {}
}
