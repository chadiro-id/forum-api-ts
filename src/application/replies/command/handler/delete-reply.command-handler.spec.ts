import { ReplyRepository } from '@main/domain/replies/reply-repository.interface';
import { DeleteReplyCommandHandler } from './delete-reply.command-handler';
import { InMemoryReplyRepository } from '@main/application/common/tests/repository/in-memory-reply-repository';
import { Reply, ReplyId } from '@main/domain/replies/reply';
import { ThreadId } from '@main/domain/threads/thread';
import { CommentId } from '@main/domain/comments/comment';
import { UserId } from '@main/domain/users/user';
import { DeleteReplyCommand } from '../delete-reply.command';
import { ReplyNotFoundError } from '../../errors/reply-not-found.error';
import { ReplyDeceptiveAccessError } from '../../errors/reply-deceptive-access.error';
import { ReplyUnauthorizedAccessError } from '../../errors/reply-unauthorized-access.error';

describe('DeleteReplyCommandHandler', () => {
  let mockReplyRepo: ReplyRepository;
  let commandHandler: DeleteReplyCommandHandler;

  beforeAll(() => {
    mockReplyRepo = new InMemoryReplyRepository();
    commandHandler = new DeleteReplyCommandHandler(mockReplyRepo);
  });

  it('should handle delete reply correctly', async () => {
    const id = new ReplyId('reply-001');
    const threadId = new ThreadId('thread-id');
    const commentId = new CommentId('comment-id');
    const userId = new UserId('user-id');

    const mockValueReply = Reply.create(
      id,
      threadId,
      commentId,
      userId,
      'Sebuah balasan',
    );
    const calledReply = Reply.create(
      id,
      threadId,
      commentId,
      userId,
      'Sebuah balasan',
    );

    mockReplyRepo.findById = jest.fn().mockResolvedValue(mockValueReply);
    mockReplyRepo.softDelete = jest.fn().mockResolvedValue(undefined);

    const command = new DeleteReplyCommand(id, commentId, threadId, userId);
    await commandHandler.handle(command);

    expect(mockReplyRepo.findById).toHaveBeenCalledTimes(1);
    expect(mockReplyRepo.findById).toHaveBeenCalledWith(command.id);
    expect(mockReplyRepo.softDelete).toHaveBeenCalledTimes(1);
    expect(mockReplyRepo.softDelete).toHaveBeenCalledWith(calledReply);
  });

  it('should throw error when reply not exists', async () => {
    const id = new ReplyId('reply-001');
    const threadId = new ThreadId('thread-id');
    const commentId = new CommentId('comment-id');
    const userId = new UserId('user-id');

    mockReplyRepo.findById = jest.fn().mockResolvedValue(null);
    mockReplyRepo.softDelete = jest.fn();

    const command = new DeleteReplyCommand(id, commentId, threadId, userId);
    await expect(commandHandler.handle(command)).rejects.toThrow(
      ReplyNotFoundError,
    );

    expect(mockReplyRepo.softDelete).not.toHaveBeenCalled();
  });

  it('should throw error when threadId not match', async () => {
    const id = new ReplyId('reply-001');
    const threadId = new ThreadId('thread-id');
    const commentId = new CommentId('comment-id');
    const userId = new UserId('user-id');
    const mismatchedThreadId = new ThreadId('thread-xxx');

    const mockValueReply = Reply.create(
      id,
      threadId,
      commentId,
      userId,
      'Sebuah balasan',
    );
    mockReplyRepo.findById = jest.fn().mockResolvedValue(mockValueReply);
    mockReplyRepo.softDelete = jest.fn();

    const command = new DeleteReplyCommand(
      id,
      commentId,
      mismatchedThreadId,
      userId,
    );
    await expect(commandHandler.handle(command)).rejects.toThrow(
      ReplyDeceptiveAccessError,
    );

    expect(mockReplyRepo.softDelete).not.toHaveBeenCalled();
  });

  it('should throw error when commentId not match', async () => {
    const id = new ReplyId('reply-001');
    const threadId = new ThreadId('thread-id');
    const commentId = new CommentId('comment-id');
    const userId = new UserId('user-id');
    const mismatchedCommentId = new CommentId('comment-xxx');

    const mockValueReply = Reply.create(
      id,
      threadId,
      commentId,
      userId,
      'Sebuah balasan',
    );
    mockReplyRepo.findById = jest.fn().mockResolvedValue(mockValueReply);
    mockReplyRepo.softDelete = jest.fn();

    const command = new DeleteReplyCommand(
      id,
      mismatchedCommentId,
      threadId,
      userId,
    );
    await expect(commandHandler.handle(command)).rejects.toThrow(
      ReplyDeceptiveAccessError,
    );

    expect(mockReplyRepo.softDelete).not.toHaveBeenCalled();
  });

  it('should throw error when userId not match', async () => {
    const id = new ReplyId('reply-001');
    const threadId = new ThreadId('thread-id');
    const commentId = new CommentId('comment-id');
    const userId = new UserId('user-id');
    const mismatchedUserId = new UserId('user-xxx');

    const mockValueReply = Reply.create(
      id,
      threadId,
      commentId,
      userId,
      'Sebuah balasan',
    );
    mockReplyRepo.findById = jest.fn().mockResolvedValue(mockValueReply);
    mockReplyRepo.softDelete = jest.fn();

    const command = new DeleteReplyCommand(
      id,
      commentId,
      threadId,
      mismatchedUserId,
    );
    await expect(commandHandler.handle(command)).rejects.toThrow(
      ReplyUnauthorizedAccessError,
    );

    expect(mockReplyRepo.softDelete).not.toHaveBeenCalled();
  });
});
