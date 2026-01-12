import { CommentRepository } from '../../../../domain/repositories/comment-repository.interface';
import { DeleteCommentCommand } from '../delete-comment.command';
import { CommentNotFoundError } from '../../errors/comment-not-found.error';
import { CommentDeceptiveAccessError } from '../../errors/comment-deceptive-access.error';
import { CommentUnauthorizedAccessError } from '../../errors/comment-unauthorized-access.error';

export class DeleteCommentCommandHandler {
  constructor(private commentRepository: CommentRepository) {}

  async handle(command: DeleteCommentCommand): Promise<void> {
    const comment = await this.commentRepository.findById(command.id);
    if (!comment) {
      throw new CommentNotFoundError();
    }

    if (!comment.threadId.equals(command.threadId)) {
      throw new CommentDeceptiveAccessError();
    }

    if (!comment.ownerId.equals(command.userId)) {
      throw new CommentUnauthorizedAccessError();
    }

    await this.commentRepository.softDelete(comment);
  }
}
