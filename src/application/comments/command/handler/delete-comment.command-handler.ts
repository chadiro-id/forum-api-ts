import { CommentRepository } from '../../../../domain/repositories/comment-repository.interface';
import { CommentNotFoundError } from '../../errors/comment-not-found.error';
import { DeleteCommentCommand } from '../delete-comment.command';

export class DeleteCommentCommandHandler {
  constructor(private commentRepository: CommentRepository) {}

  async handle(command: DeleteCommentCommand): Promise<void> {
    const comment = await this.commentRepository.findById(command.id);
    if (comment === null) {
      throw new CommentNotFoundError();
    }

    comment.verifyNonDeceptiveAccess(command.threadId);
    comment.verifyAccessRights(command.userId);
    comment.markAsDeleted();

    await this.commentRepository.updateById(comment.id, { isDelete: true });
  }
}
