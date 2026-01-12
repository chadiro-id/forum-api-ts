import { ReplyId } from '@main/domain/replies/reply';
import { DeleteReplyCommand } from './delete-reply.command';
import { ThreadId } from '@main/domain/threads/thread';
import { CommentId } from '@main/domain/comments/comment';
import { UserId } from '@main/domain/users/user';

describe('DeleteReplyCommand', () => {
  it('should correctly initialize data', () => {
    const id = new ReplyId('reply-id');
    const threadId = new ThreadId('thread-id');
    const commentId = new CommentId('comment-id');
    const userId = new UserId('user-123');

    const command = new DeleteReplyCommand(id, commentId, threadId, userId);
    expect(command.id).toStrictEqual(id);
    expect(command.threadId).toStrictEqual(threadId);
    expect(command.commentId).toStrictEqual(commentId);
    expect(command.userId).toStrictEqual(userId);
  });
});
