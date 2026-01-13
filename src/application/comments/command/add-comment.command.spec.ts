import { ThreadId } from '@main/domain/threads/thread';
import { AddCommentCommand } from './add-comment.command';
import { UserId } from '@main/domain/users/entities/user';
import { ApplicationError } from '@main/application/common/errors/application-error';

describe('AddCommentCommand', () => {
  it('should correctly initialize data', () => {
    const command = new AddCommentCommand(
      'thread-id',
      'user-id',
      'Sebuah komentar',
    );

    expect(command.threadId).toStrictEqual(new ThreadId('thread-id'));
    expect(command.userId).toStrictEqual(new UserId('user-id'));
    expect(command.content).toBe('Sebuah komentar');
  });

  it('should throw error when content not valid string', async () => {
    expect(
      () =>
        new AddCommentCommand('thread-id', 'user-id', 123 as unknown as string),
    ).toThrow(ApplicationError);
    expect(() => new AddCommentCommand('thread-id', 'user-id', '')).toThrow(
      'content cannot be empty',
    );
  });
});
