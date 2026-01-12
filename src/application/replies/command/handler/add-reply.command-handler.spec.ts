import { CommentRepository } from '@main/domain/comments/comment-repository.interface';
import { ReplyRepository } from '@main/domain/replies/reply-repository.interface';
import { AddReplyCommandHandler } from './add-reply.command-handler';
import { InMemoryCommentRepository } from '@main/application/common/tests/repository/in-memory-comment-repository';
import { InMemoryReplyRepository } from '@main/application/common/tests/repository/in-memory-reply-repository';
import { Reply, ReplyId } from '@main/domain/replies/reply';
import { ThreadId } from '@main/domain/entities/thread';
import { CommentId } from '@main/domain/comments/comment';
import { UserId } from '@main/domain/entities/user';
import { AddReplyCommand } from '../add-reply.command';
import { AddedReplyReport } from '../../reports/added-reply.report';
import { CommentNotFoundError } from '@main/application/comments/errors/comment-not-found.error';
jest.useFakeTimers();

describe('AddReplyCommandHandler', () => {
  let mockCommentRepo: CommentRepository;
  let mockReplyRepo: ReplyRepository;
  let commandHandler: AddReplyCommandHandler;

  beforeAll(() => {
    mockCommentRepo = new InMemoryCommentRepository();
    mockReplyRepo = new InMemoryReplyRepository();
    commandHandler = new AddReplyCommandHandler(
      mockCommentRepo,
      mockReplyRepo,
      () => 'reply-001',
    );
  });

  it('should handle add reply correctly', async () => {
    mockCommentRepo.existsBy = jest.fn().mockResolvedValue(true);
    mockReplyRepo.add = jest.fn().mockResolvedValue(undefined);

    const threadId = new ThreadId('thread-001');
    const commentId = new CommentId('comment-002');
    const userId = new UserId('user-003');

    const calledReply = Reply.create(
      new ReplyId('reply-001'),
      threadId,
      commentId,
      userId,
      'Sebuah balasan',
    );

    const command = new AddReplyCommand(
      threadId,
      commentId,
      userId,
      'Sebuah balasan',
    );
    const result = await commandHandler.handle(command);

    expect(result).toStrictEqual(
      new AddedReplyReport('reply-001', 'Sebuah balasan', userId.value),
    );
    expect(mockCommentRepo.existsBy).toHaveBeenCalledWith({
      id: commentId,
      threadId,
      isDelete: false,
    });
    expect(mockReplyRepo.add).toHaveBeenCalledWith(calledReply);
  });

  it('should throw error when comment not found', async () => {
    mockCommentRepo.existsBy = jest.fn().mockResolvedValue(false);
    mockReplyRepo.add = jest.fn();

    const command = new AddReplyCommand(
      new ThreadId('thread-001'),
      new CommentId('comment-001'),
      new UserId('user-001'),
      'Sebuah balasan',
    );
    await expect(commandHandler.handle(command)).rejects.toThrow(
      CommentNotFoundError,
    );

    expect(mockReplyRepo.add).not.toHaveBeenCalled();
  });
});
