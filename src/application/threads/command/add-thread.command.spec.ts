import { UserId } from '@main/domain/users/user';
import { AddThreadCommand } from './add-thread.command';
import { ApplicationError } from '@main/application/common/errors/application-error';

describe('AddThreadCommand', () => {
  it('should correctly initialize data', () => {
    const command = new AddThreadCommand(
      'Sebuah thread',
      'Isi thread',
      'user-id',
    );

    expect(command.title).toBe('Sebuah thread');
    expect(command.body).toBe('Isi thread');
    expect(command.userId).toStrictEqual(new UserId('user-id'));
  });

  it('should throw error when missing arguments', () => {
    const missingTitle = undefined as unknown as string;
    const missingBody = undefined as unknown as string;

    expect(() => new AddThreadCommand(missingTitle, 'body', 'user-id')).toThrow(
      ApplicationError,
    );
    expect(() => new AddThreadCommand('title', missingBody, 'user-id')).toThrow(
      ApplicationError,
    );
  });

  it('should throw error when args data type mismatch', () => {
    const invalidTitle = 123 as unknown as string;
    const invalidBody = ['body'] as unknown as string;

    expect(() => new AddThreadCommand(invalidTitle, 'body', 'user-id')).toThrow(
      ApplicationError,
    );
    expect(() => new AddThreadCommand('title', invalidBody, 'user-id')).toThrow(
      ApplicationError,
    );
  });
});
