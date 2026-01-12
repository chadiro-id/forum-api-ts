import { ThreadId } from '@main/domain/threads/thread';
import { AddReplyCommand } from './add-reply.command';
import { CommentId } from '@main/domain/comments/comment';
import { UserId } from '@main/domain/users/user';
import { ApplicationError } from '@main/application/common/errors/application-error';

describe('AddReplyCommand', () => {
  it('should correctly initialize data', () => {
    const command = new AddReplyCommand(
      'thread-id',
      'comment-id',
      'user-id',
      'Sebuah balasan',
    );

    expect(command.threadId).toStrictEqual(new ThreadId('thread-id'));
    expect(command.commentId).toStrictEqual(new CommentId('comment-id'));
    expect(command.userId).toStrictEqual(new UserId('user-id'));
    expect(command.content).toBe('Sebuah balasan');
  });

  it('should throw error when content not valid string', () => {
    expect(
      () =>
        new AddReplyCommand(
          'thread-id',
          'comment-id',
          'user-id',
          123 as unknown as string,
        ),
    ).toThrow(ApplicationError);

    expect(
      () => new AddReplyCommand('thread-id', 'comment-id', 'user-id', ''),
    ).toThrow('content cannot be empty');
  });
});
