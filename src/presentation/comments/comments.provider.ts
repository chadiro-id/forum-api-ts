import { ThreadRepository } from '../../domain/threads/thread-repository.interface';
import { CommentRepository } from '../../domain/comments/comment-repository.interface';
import { AddCommentCommandHandler } from '../../application/comments/command/handler/add-comment.command-handler';
import { DeleteCommentCommandHandler } from '../../application/comments/command/handler/delete-comment.command-handler';
import {
  ID_GENERATOR,
  THREAD_REPOSITORY,
  COMMENT_REPOSITORY,
  COMMENT_LIKE_REPOSITORY,
} from '../../shared/injections.constant';
import { LikeCommentCommandHandler } from '@main/application/comments/command/handler/like-comment.command-handler';
import { CommentLikeRepository } from '@main/domain/comments/comment-like-repository.interface';

export const AddCommentCommandHandlerProvider = {
  provide: AddCommentCommandHandler,
  useFactory: (
    threadRepository: ThreadRepository,
    commentRepository: CommentRepository,
    idGenerator: () => string,
  ) =>
    new AddCommentCommandHandler(
      threadRepository,
      commentRepository,
      idGenerator,
    ),
  inject: [THREAD_REPOSITORY, COMMENT_REPOSITORY, ID_GENERATOR],
};

export const DeleteCommentCommandHandlerProvider = {
  provide: DeleteCommentCommandHandler,
  useFactory: (commentRepo: CommentRepository) =>
    new DeleteCommentCommandHandler(commentRepo),
  inject: [COMMENT_REPOSITORY],
};

export const LikeCommentCommandHandlerProvider = {
  provide: LikeCommentCommandHandler,
  useFactory: (
    commentRepository: CommentRepository,
    commentLikeRepository: CommentLikeRepository,
  ) => new LikeCommentCommandHandler(commentRepository, commentLikeRepository),
  inject: [COMMENT_REPOSITORY, COMMENT_LIKE_REPOSITORY],
};
