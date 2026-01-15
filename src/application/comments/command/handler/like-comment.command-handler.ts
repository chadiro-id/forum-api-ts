import { CommentRepository } from '@main/domain/comments/comment-repository.interface';
import { CommentLikeRepository } from '@main/domain/comments/comment-like-repository.interface';
import { LikeCommentCommand } from '../like-comment.command';
import { CommentNotFoundError } from '../../errors/comment-not-found.error';
import { CommentLike } from '@main/domain/comments/entities/comment-like';

export class LikeCommentCommandHandler {
  constructor(
    private commentRepository: CommentRepository,
    private commentLikeRepository: CommentLikeRepository,
  ) {}

  async handle(command: LikeCommentCommand): Promise<void> {
    const commentExists = await this.commentRepository.existsBy({
      id: command.id,
      threadId: command.threadId,
    });
    if (!commentExists) {
      throw new CommentNotFoundError();
    }

    const commentLike = await this.commentLikeRepository.find({
      commentId: command.id,
      userId: command.userId,
    });

    if (commentLike) {
      await this.commentLikeRepository.delete(commentLike);
    } else {
      const newCommentLike = CommentLike.create(command.id, command.userId);
      const id = await this.commentLikeRepository.add(newCommentLike);
      newCommentLike.assignId(id);
    }
  }
}
