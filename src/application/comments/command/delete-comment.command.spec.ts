import { CommentId } from '@main/domain/comments/comment';
import { DeleteCommentCommand } from './delete-comment.command';
import { ThreadId } from '@main/domain/threads/thread';
import { UserId } from '@main/domain/users/user';

describe('DeleteCommentCommand', () => {
  it('should initialize with valid data', () => {
    const id = new CommentId('comment-id');
    const threadId = new ThreadId('thread-id');
    const userId = new UserId('user-id');

    const command = new DeleteCommentCommand(id, threadId, userId);

    expect(command.id).toStrictEqual(id);
    expect(command.threadId).toStrictEqual(threadId);
    expect(command.userId).toStrictEqual(userId);
  });
});
