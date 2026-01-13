import { CommentRepository } from '../../../../domain/comments/comment-repository.interface';
import { ReplyRepository } from '../../../../domain/replies/reply-repository.interface';
import { Reply, ReplyId } from '../../../../domain/replies/entities/reply';
import { CommentNotFoundError } from '../../../comments/errors/comment-not-found.error';
import { AddReplyCommand } from '../add-reply.command';
import { AddedReplyReport } from '../../reports/added-reply.report';

export class AddReplyCommandHandler {
  constructor(
    private commentRepository: CommentRepository,
    private replyRepository: ReplyRepository,
    private idGenerator: () => string,
  ) {}

  async handle(command: AddReplyCommand): Promise<AddedReplyReport> {
    const { threadId, commentId, userId, content } = command;

    const isCommentExists = await this.commentRepository.existsBy({
      id: commentId,
      threadId,
      isDelete: false,
    });

    if (!isCommentExists) {
      throw new CommentNotFoundError();
    }

    const id = new ReplyId(this.idGenerator());
    const reply = Reply.create(id, threadId, commentId, userId, content);

    await this.replyRepository.add(reply);

    return AddedReplyReport.fromEntity(reply);
  }
}
