import { UserId } from '@main/domain/users/user';
import { AddThreadCommand } from './add-thread.command';

describe('AddThreadCommand', () => {
  it('should correctly initialize data', () => {
    const userId = new UserId('user-id');
    const command = new AddThreadCommand('Sebuah thread', 'Isi thread', userId);

    expect(command.title).toBe('Sebuah thread');
    expect(command.body).toBe('Isi thread');
    expect(command.userId).toStrictEqual(userId);
  });
});
