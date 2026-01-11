import { ApplicationError } from '@main/application/common/errors/application-error';
import { CommentRepository } from '../../../../domain/repositories/comment-repository.interface';
import { DeleteCommentCommand } from '../delete-comment.command';

export class DeleteCommentCommandHandler {
  constructor(private commentRepository: CommentRepository) {}

  async handle(command: DeleteCommentCommand): Promise<void> {
    const comment = await this.commentRepository.findById(command.id);
    if (comment === null || comment.isDelete) {
      throw new ApplicationError(
        'komentar tidak ditemukan',
        'KEY_NOT_FOUND_ERROR',
      );
    }

    if (!comment.threadId.equals(command.threadId)) {
      throw new ApplicationError(
        'tidak dapat mengakses sumber daya',
        'DECEPTIVE_ACCESS_ERROR',
      );
    }

    if (!comment.ownerId.equals(command.userId)) {
      throw new ApplicationError(
        'pengguna tidak memiliki hak akses',
        'UNAUTHORIZED_ACCESS_ERROR',
      );
    }

    await this.commentRepository.softDelete(comment);
  }
}
