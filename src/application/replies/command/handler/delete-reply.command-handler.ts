import { ReplyRepository } from '../../../../domain/repositories/reply-repository.interface';
import { ReplyDeceptiveAccessError } from '../../errors/reply-deceptive-access.error';
import { ReplyNotFoundError } from '../../errors/reply-not-found.error';
import { ReplyUnauthorizedAccessError } from '../../errors/reply-unauthorized-access.error';
import { DeleteReplyCommand } from '../delete-reply.command';

export class DeleteReplyCommandHandler {
  constructor(private replyRepository: ReplyRepository) {}

  async handle(command: DeleteReplyCommand): Promise<void> {
    const { id, threadId, commentId, userId } = command;

    const reply = await this.replyRepository.findById(id);
    if (!reply) {
      throw new ReplyNotFoundError();
    }

    if (
      !reply.threadId.equals(threadId) ||
      !reply.commentId.equals(commentId)
    ) {
      throw new ReplyDeceptiveAccessError();
    }

    if (!reply.ownerId.equals(userId)) {
      throw new ReplyUnauthorizedAccessError('');
    }

    await this.replyRepository.softDelete(reply);
  }
}
