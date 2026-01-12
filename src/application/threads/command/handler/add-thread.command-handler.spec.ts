import { UserId } from '@main/domain/users/user';
import { InMemoryThreadRepository } from '../../../common/tests/repository/in-memory-thread-repository';
import { ThreadRepository } from '../../../../domain/threads/thread-repository.interface';
import { AddThreadCommand } from '../add-thread.command';
import { AddThreadCommandHandler } from './add-thread.command-handler';
import { AddedThreadReport } from '../../reports/added-thread.report';

describe('AddThreadCommandHandler', () => {
  let threadRepo: ThreadRepository;
  let commandHandler: AddThreadCommandHandler;

  beforeAll(() => {
    threadRepo = new InMemoryThreadRepository();
    commandHandler = new AddThreadCommandHandler(
      threadRepo,
      () => 'thread-001',
    );
  });

  it('should handle add thread correctly', async () => {
    threadRepo.add = jest.fn().mockResolvedValue(undefined);

    const command = new AddThreadCommand(
      'Sebuah thread',
      'Isi thread',
      new UserId('user-001'),
    );
    const result = await commandHandler.handle(command);

    expect(result).toStrictEqual(
      new AddedThreadReport('thread-001', 'Sebuah thread', 'user-001'),
    );
  });
});
