import { CommentRepository } from '@main/domain/comments/comment-repository.interface';
import { ThreadRepository } from '@main/domain/threads/thread-repository.interface';
import { AddCommentCommandHandler } from './add-comment.command-handler';
import { AddCommentCommand } from '../add-comment.command';
import { ThreadId } from '@main/domain/threads/entities/thread';
import { UserId } from '@main/domain/users/entities/user';
import { Comment, CommentId } from '@main/domain/comments/entities/comment';
import { ThreadNotFoundError } from '@main/application/threads/errors/thread-not-found.error';
import { AddedCommentReport } from '../../reports/added-comment.report';
import { MockThreadRepository } from '@main/domain/threads/thread-repository.spec';
import { MockCommentRepository } from '@main/domain/comments/comment-repository.spec';

jest.useFakeTimers();
describe('AddCommentCommandHandler', () => {
  let mockThreadRepo: ThreadRepository;
  let mockCommentRepo: CommentRepository;
  let commandHandler: AddCommentCommandHandler;

  beforeAll(() => {
    mockThreadRepo = new MockThreadRepository();
    mockCommentRepo = new MockCommentRepository();
    commandHandler = new AddCommentCommandHandler(
      mockThreadRepo,
      mockCommentRepo,
      () => 'comment-001',
    );
  });

  it('should handle add comment correctly', async () => {
    mockThreadRepo.existsById = jest.fn().mockResolvedValue(true);
    mockCommentRepo.add = jest.fn().mockResolvedValue(undefined);

    const threadId = new ThreadId('thread-id');
    const userId = new UserId('user-id');

    const calledComment = Comment.create(
      new CommentId('comment-001'),
      threadId,
      userId,
      'Sebuah komentar',
    );

    const command = new AddCommentCommand(
      'thread-id',
      'user-id',
      'Sebuah komentar',
    );
    const result = await commandHandler.handle(command);

    expect(result).toStrictEqual(
      new AddedCommentReport('comment-001', 'Sebuah komentar', 'user-id'),
    );
    expect(mockThreadRepo.existsById).toHaveBeenCalledWith(command.threadId);
    expect(mockCommentRepo.add).toHaveBeenCalledWith(calledComment);
  });

  it('should throw error when thread not exists', async () => {
    mockThreadRepo.existsById = jest.fn().mockResolvedValue(false);
    mockCommentRepo.add = jest.fn();

    const command = new AddCommentCommand(
      'thread-id',
      'user-id',
      'Sebuah komentar',
    );
    await expect(commandHandler.handle(command)).rejects.toThrow(
      ThreadNotFoundError,
    );

    expect(mockThreadRepo.existsById).toHaveBeenCalledTimes(1);
    expect(mockCommentRepo.add).not.toHaveBeenCalled();
  });
});
