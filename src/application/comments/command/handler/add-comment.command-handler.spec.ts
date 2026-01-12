import { CommentRepository } from '@main/domain/repositories/comment-repository.interface';
import { ThreadRepository } from '@main/domain/repositories/thread-repository.interface';
import { AddCommentCommandHandler } from './add-comment.command-handler';
import { InMemoryThreadRepository } from '@main/application/common/tests/repository/in-memory-thread-repository';
import { InMemoryCommentRepository } from '@main/application/common/tests/repository/in-memory-comment-repository';
import { AddCommentCommand } from '../add-comment.command';
import { ThreadId } from '@main/domain/entities/thread';
import { UserId } from '@main/domain/entities/user';
import { Comment, CommentId } from '@main/domain/entities/comment';
import { ThreadNotFoundError } from '@main/application/threads/errors/thread-not-found.error';
jest.useFakeTimers();

describe('AddCommentCommandHandler', () => {
  let mockThreadRepo: ThreadRepository;
  let mockCommentRepo: CommentRepository;
  let commandHandler: AddCommentCommandHandler;

  beforeAll(() => {
    mockThreadRepo = new InMemoryThreadRepository();
    mockCommentRepo = new InMemoryCommentRepository();
    commandHandler = new AddCommentCommandHandler(
      mockThreadRepo,
      mockCommentRepo,
      () => 'comment-001',
    );
  });

  it('should handle add comment correctly', async () => {
    mockThreadRepo.existsById = jest.fn().mockResolvedValue(true);
    mockCommentRepo.add = jest.fn().mockResolvedValue(undefined);

    const threadId = new ThreadId('thread-002');
    const userId = new UserId('user-001');

    const calledComment = Comment.create(
      new CommentId('comment-001'),
      threadId,
      userId,
      'Sebuah komentar',
    );

    const command = new AddCommentCommand(threadId, userId, 'Sebuah komentar');
    await commandHandler.handle(command);

    expect(mockThreadRepo.existsById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepo.add).toHaveBeenCalledWith(calledComment);
  });

  it('should throw error when thread not exists', async () => {
    mockThreadRepo.existsById = jest.fn().mockResolvedValue(false);
    mockCommentRepo.add = jest.fn();

    const threadId = new ThreadId('thread-002');
    const userId = new UserId('user-001');

    const command = new AddCommentCommand(threadId, userId, 'Sebuah komentar');
    await expect(commandHandler.handle(command)).rejects.toThrow(
      ThreadNotFoundError,
    );

    expect(mockCommentRepo.add).not.toHaveBeenCalled();
  });
});
