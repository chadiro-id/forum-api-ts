import { CommentLikeRepository } from '@main/domain/comments/comment-like-repository.interface';
import { CommentRepository } from '@main/domain/comments/comment-repository.interface';
import { LikeCommentCommandHandler } from './like-comment.command-handler';
import { MockCommentRepository } from '@main/domain/comments/comment-repository.mock';
import { MockCommentLikeRepository } from '@main/domain/comments/comment-like-repository.mock';
import { LikeCommentCommand } from '../like-comment.command';
import {
  CommentLike,
  CommentLikeId,
} from '@main/domain/comments/entities/comment-like';
import { CommentId } from '@main/domain/comments/entities/comment';
import { UserId } from '@main/domain/users/entities/user';
import { CommentNotFoundError } from '../../errors/comment-not-found.error';

describe('LikeCommentCommandHandler', () => {
  let mockCommentRepo: CommentRepository;
  let mockCommentLikeRepo: CommentLikeRepository;
  let commandHandler: LikeCommentCommandHandler;

  beforeAll(() => {
    mockCommentRepo = new MockCommentRepository();
    mockCommentLikeRepo = new MockCommentLikeRepository();
    commandHandler = new LikeCommentCommandHandler(
      mockCommentRepo,
      mockCommentLikeRepo,
    );
  });

  it('should like comment when not already liked', async () => {
    mockCommentRepo.existsBy = jest.fn().mockResolvedValue(true);
    mockCommentLikeRepo.find = jest.fn().mockResolvedValue(null);
    mockCommentLikeRepo.add = jest.fn().mockResolvedValue(new CommentLikeId(1));
    mockCommentLikeRepo.delete = jest.fn();

    const command = new LikeCommentCommand(
      'comment-001',
      'thread-id',
      'user-id',
    );
    const calledCommentLike = CommentLike.create(command.id, command.userId);
    calledCommentLike.assignId(new CommentLikeId(1));

    await commandHandler.handle(command);

    expect(mockCommentRepo.existsBy).toHaveBeenCalledWith({
      id: command.id,
      threadId: command.threadId,
    });
    expect(mockCommentLikeRepo.find).toHaveBeenCalledWith({
      commentId: command.id,
      userId: command.userId,
    });
    expect(mockCommentLikeRepo.add).toHaveBeenCalledWith(calledCommentLike);
    expect(mockCommentLikeRepo.delete).not.toHaveBeenCalled();
  });

  it('should unlike comment when already liked', async () => {
    const commentLikeId = new CommentLikeId(1);
    const commentId = new CommentId('comment-001');
    const userId = new UserId('user-id');
    const mockValueCommentLike = CommentLike.restore(
      commentLikeId,
      commentId,
      userId,
    );

    mockCommentRepo.existsBy = jest.fn().mockResolvedValue(true);
    mockCommentLikeRepo.find = jest
      .fn()
      .mockResolvedValue(mockValueCommentLike);
    mockCommentLikeRepo.delete = jest.fn().mockResolvedValue(undefined);
    mockCommentLikeRepo.add = jest.fn();

    const command = new LikeCommentCommand(
      'comment-001',
      'thread-id',
      'user-id',
    );
    const calledCommentLike = CommentLike.restore(
      commentLikeId,
      command.id,
      command.userId,
    );

    await commandHandler.handle(command);

    expect(mockCommentRepo.existsBy).toHaveBeenCalledWith({
      id: command.id,
      threadId: command.threadId,
    });
    expect(mockCommentLikeRepo.find).toHaveBeenCalledWith({
      commentId: command.id,
      userId: command.userId,
    });
    expect(mockCommentLikeRepo.delete).toHaveBeenCalledWith(calledCommentLike);
    expect(mockCommentLikeRepo.add).not.toHaveBeenCalled();
  });

  it('should throw error when comment not found', async () => {
    mockCommentRepo.existsBy = jest.fn().mockResolvedValue(false);
    mockCommentLikeRepo.find = jest.fn();

    const command = new LikeCommentCommand(
      'comment-001',
      'thread-id',
      'user-id',
    );
    await expect(commandHandler.handle(command)).rejects.toThrow(
      CommentNotFoundError,
    );

    expect(mockCommentLikeRepo.find).not.toHaveBeenCalled();
  });
});
