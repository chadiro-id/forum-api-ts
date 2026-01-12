import { CommentRepository } from '../../domain/comments/comment-repository.interface';
import { ReplyRepository } from '../../domain/repositories/reply-repository.interface';
import { AddReplyCommandHandler } from '../../application/replies/command/handler/add-reply.command-handler';
import { DeleteReplyCommandHandler } from '../../application/replies/command/handler/delete-reply.command-handler';
import {
  ID_GENERATOR,
  COMMENT_REPOSITORY,
  REPLY_REPOSITORY,
} from '../../shared/injections.constant';

export const AddReplyCommandHandlerProvider = {
  provide: AddReplyCommandHandler,
  useFactory: (
    commentRepo: CommentRepository,
    replyRepo: ReplyRepository,
    idGenerator: () => string,
  ) => new AddReplyCommandHandler(commentRepo, replyRepo, idGenerator),
  inject: [COMMENT_REPOSITORY, REPLY_REPOSITORY, ID_GENERATOR],
};

export const DeleteReplyCommandHandlerProvider = {
  provide: DeleteReplyCommandHandler,
  useFactory: (replyRepository: ReplyRepository) =>
    new DeleteReplyCommandHandler(replyRepository),
  inject: [REPLY_REPOSITORY],
};
