import { ThreadId } from '@main/domain/threads/thread';
import { AddCommentCommand } from './add-comment.command';
import { UserId } from '@main/domain/users/user';

describe('AddCommentCommand', () => {
  it('should initialize with valid data', () => {
    const threadId = new ThreadId('thread-id');
    const userId = new UserId('user-id');

    const command = new AddCommentCommand(threadId, userId, 'Sebuah komentar');

    expect(command.threadId).toStrictEqual(threadId);
    expect(command.userId).toStrictEqual(userId);
    expect(command.content).toBe('Sebuah komentar');
  });
});
