import { CommentId } from '@main/domain/comments/comment';
import { DeleteCommentCommand } from './delete-comment.command';
import { ThreadId } from '@main/domain/threads/thread';
import { UserId } from '@main/domain/users/user';

describe('DeleteCommentCommand', () => {
  it('should correctly initialize data', () => {
    const command = new DeleteCommentCommand(
      'comment-id',
      'thread-id',
      'user-id',
    );

    expect(command.id).toStrictEqual(new CommentId('comment-id'));
    expect(command.threadId).toStrictEqual(new ThreadId('thread-id'));
    expect(command.userId).toStrictEqual(new UserId('user-id'));
  });
});
