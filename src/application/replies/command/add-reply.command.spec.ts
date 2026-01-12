import { ThreadId } from '@main/domain/threads/thread';
import { AddReplyCommand } from './add-reply.command';
import { CommentId } from '@main/domain/comments/comment';
import { UserId } from '@main/domain/users/user';

describe('AddReplyCommand', () => {
  it('should correctly initialize data', () => {
    const threadId = new ThreadId('thread-id');
    const commentId = new CommentId('comment-id');
    const userId = new UserId('user-id');
    const command = new AddReplyCommand(
      threadId,
      commentId,
      userId,
      'Sebuah balasan',
    );

    expect(command.threadId).toStrictEqual(threadId);
    expect(command.commentId).toStrictEqual(commentId);
    expect(command.userId).toStrictEqual(userId);
    expect(command.content).toBe('Sebuah balasan');
  });
});
