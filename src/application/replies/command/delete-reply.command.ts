import { CommentId } from '../../../domain/entities/comment';
import { ReplyId } from '../../../domain/entities/reply';
import { ThreadId } from '../../../domain/entities/thread';
import { UserId } from '../../../domain/entities/user';

export class DeleteReplyCommand {
  constructor(
    public readonly id: ReplyId,
    public readonly commentId: CommentId,
    public readonly threadId: ThreadId,
    public readonly userId: UserId,
  ) {}
}
