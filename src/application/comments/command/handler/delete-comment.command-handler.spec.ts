import { CommentRepository } from '@main/domain/comments/comment-repository.interface';
import { DeleteCommentCommandHandler } from './delete-comment.command-handler';
import { InMemoryCommentRepository } from '@main/application/common/tests/repository/in-memory-comment-repository';
import { Comment, CommentId } from '@main/domain/comments/comment';
import { ThreadId } from '@main/domain/threads/thread';
import { UserId } from '@main/domain/users/entities/user';
import { DeleteCommentCommand } from '../delete-comment.command';
import { CommentNotFoundError } from '../../errors/comment-not-found.error';
import { CommentDeceptiveAccessError } from '../../errors/comment-deceptive-access.error';
import { CommentUnauthorizedAccessError } from '../../errors/comment-unauthorized-access.error';

describe('DeleteCommentCommandHandler', () => {
  let mockCommentRepo: CommentRepository;
  let commandHandler: DeleteCommentCommandHandler;

  beforeAll(() => {
    mockCommentRepo = new InMemoryCommentRepository();
    commandHandler = new DeleteCommentCommandHandler(mockCommentRepo);
  });

  it('should handle delete comment correctly', async () => {
    const id = new CommentId('comment-001');
    const threadId = new ThreadId('thread-id');
    const userId = new UserId('user-id');

    const mockEntity = Comment.create(id, threadId, userId, 'Sebuah komentar');
    const calledEntity = Comment.create(
      id,
      threadId,
      userId,
      'Sebuah komentar',
    );

    mockCommentRepo.findById = jest.fn().mockResolvedValue(mockEntity);
    mockCommentRepo.softDelete = jest.fn().mockResolvedValue(undefined);

    const command = new DeleteCommentCommand(
      'comment-001',
      'thread-id',
      'user-id',
    );
    await commandHandler.handle(command);

    expect(mockCommentRepo.findById).toHaveBeenCalledWith(id);
    expect(mockCommentRepo.softDelete).toHaveBeenCalledWith(calledEntity);
  });

  it('should throw error when comment not exists', async () => {
    mockCommentRepo.findById = jest.fn().mockResolvedValue(null);
    mockCommentRepo.softDelete = jest.fn();

    const command = new DeleteCommentCommand(
      'comment-001',
      'thread-id',
      'user-id',
    );
    await expect(commandHandler.handle(command)).rejects.toThrow(
      CommentNotFoundError,
    );

    expect(mockCommentRepo.findById).toHaveBeenCalledTimes(1);
    expect(mockCommentRepo.softDelete).not.toHaveBeenCalled();
  });

  it('should throw error when threadId not match', async () => {
    const id = new CommentId('comment-001');
    const threadId = new ThreadId('thread-id');
    const userId = new UserId('user-id');

    const mockEntity = Comment.create(id, threadId, userId, 'Sebuah komentar');

    mockCommentRepo.findById = jest.fn().mockResolvedValue(mockEntity);
    mockCommentRepo.softDelete = jest.fn();

    const command = new DeleteCommentCommand(
      'comment-001',
      'thread-xxx',
      'user-id',
    );
    await expect(commandHandler.handle(command)).rejects.toThrow(
      CommentDeceptiveAccessError,
    );

    expect(mockCommentRepo.findById).toHaveBeenCalledWith(id);
    expect(mockCommentRepo.softDelete).not.toHaveBeenCalled();
  });

  it('should throw error when userId not match', async () => {
    const id = new CommentId('comment-001');
    const threadId = new ThreadId('thread-id');
    const userId = new UserId('user-id');

    const mockValueComment = Comment.create(
      id,
      threadId,
      userId,
      'Sebuah komentar',
    );

    mockCommentRepo.findById = jest.fn().mockResolvedValue(mockValueComment);
    mockCommentRepo.softDelete = jest.fn();

    const command = new DeleteCommentCommand(
      'comment-001',
      'thread-id',
      'user-xxx',
    );
    await expect(commandHandler.handle(command)).rejects.toThrow(
      CommentUnauthorizedAccessError,
    );

    expect(mockCommentRepo.findById).toHaveBeenCalledWith(id);
    expect(mockCommentRepo.softDelete).not.toHaveBeenCalled();
  });
});
