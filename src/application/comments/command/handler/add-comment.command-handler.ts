import { CommentRepository } from '../../../../domain/comments/comment-repository.interface';
import { ThreadRepository } from '../../../../domain/threads/thread-repository.interface';
import { Comment, CommentId } from '../../../../domain/comments/entities/comment';
import { ThreadNotFoundError } from '../../../threads/errors/thread-not-found.error';
import { AddCommentCommand } from '../add-comment.command';
import { AddedCommentReport } from '../../reports/added-comment.report';

export class AddCommentCommandHandler {
  constructor(
    private threadRepository: ThreadRepository,
    private commentRepository: CommentRepository,
    private idGenerator: () => string,
  ) {}

  async handle(command: AddCommentCommand): Promise<AddedCommentReport> {
    const { threadId, userId, content } = command;

    const isThreadExists = await this.threadRepository.existsById(threadId);
    if (!isThreadExists) {
      throw new ThreadNotFoundError(threadId.value);
    }

    const id = new CommentId(this.idGenerator());
    const comment = Comment.create(id, threadId, userId, content);

    await this.commentRepository.add(comment);

    return AddedCommentReport.fromEntity(comment);
  }
}
