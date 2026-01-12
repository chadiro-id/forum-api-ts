import { ThreadId } from '../../../domain/threads/thread';
import { UserId } from '../../../domain/users/user';

export class AddCommentCommand {
  constructor(
    public readonly threadId: ThreadId,
    public readonly userId: UserId,
    public readonly content: string,
  ) {}
}
