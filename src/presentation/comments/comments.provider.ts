import { ThreadRepository } from '../../domain/repositories/thread-repository.interface';
import { CommentRepository } from '../../domain/repositories/comment-repository.interface';
import { AddCommentCommandHandler } from '../../application/comments/command/handler/add-comment.command-handler';
import { DeleteCommentCommandHandler } from '../../application/comments/command/handler/delete-comment.command-handler';
import {
  ID_GENERATOR,
  THREAD_REPOSITORY,
  COMMENT_REPOSITORY,
} from '../../shared/injections.constant';

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
