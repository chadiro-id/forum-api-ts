import { CommentId } from '@main/domain/comments/entities/comment';
import { LikeCommentCommand } from './like-comment.command';
import { ThreadId } from '@main/domain/threads/entities/thread';
import { UserId } from '@main/domain/users/entities/user';

describe('LikeCommentCommand', () => {
  it('should correctly initialize data', () => {
    const command = new LikeCommentCommand(
      'comment-001',
      'thread-id',
      'user-id',
    );

    expect(command.id).toStrictEqual(new CommentId('comment-001'));
    expect(command.threadId).toStrictEqual(new ThreadId('thread-id'));
    expect(command.userId).toStrictEqual(new UserId('user-id'));
  });
});
