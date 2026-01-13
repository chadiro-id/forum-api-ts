import { ReplyId } from '@main/domain/replies/entities/reply';
import { DeleteReplyCommand } from './delete-reply.command';
import { ThreadId } from '@main/domain/threads/entities/thread';
import { CommentId } from '@main/domain/comments/comment';
import { UserId } from '@main/domain/users/entities/user';

describe('DeleteReplyCommand', () => {
  it('should correctly initialize data', () => {
    const command = new DeleteReplyCommand(
      'reply-id',
      'comment-id',
      'thread-id',
      'user-id',
    );

    expect(command.id).toStrictEqual(new ReplyId('reply-id'));
    expect(command.threadId).toStrictEqual(new ThreadId('thread-id'));
    expect(command.commentId).toStrictEqual(new CommentId('comment-id'));
    expect(command.userId).toStrictEqual(new UserId('user-id'));
  });
});
