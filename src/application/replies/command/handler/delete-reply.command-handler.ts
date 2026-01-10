import { ReplyRepository } from '../../../../domain/repositories/reply-repository.interface';
import { ReplyNotFoundError } from '../../errors/reply-not-found.error';
import { DeleteReplyCommand } from '../delete-reply.command';

export class DeleteReplyCommandHandler {
  constructor(private replyRepository: ReplyRepository) {}

  async handle(command: DeleteReplyCommand): Promise<void> {
    const { id, threadId, commentId, userId } = command;

    const reply = await this.replyRepository.findById(id);
    if (!reply) {
      throw new ReplyNotFoundError();
    }

    reply.verifyNonDeceptiveAccess(threadId, commentId);
    reply.verifyAccessRights(userId);

    await this.replyRepository.softDelete(reply);
  }
}
