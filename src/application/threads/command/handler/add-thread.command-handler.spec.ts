import { UserId } from '@main/domain/users/entities/user';
import { ThreadRepository } from '../../../../domain/threads/thread-repository.interface';
import { AddThreadCommand } from '../add-thread.command';
import { AddThreadCommandHandler } from './add-thread.command-handler';
import { AddedThreadReport } from '../../reports/added-thread.report';
import { Thread, ThreadId } from '@main/domain/threads/entities/thread';
import { MockThreadRepository } from '@main/domain/threads/thread-repository.spec';

jest.useFakeTimers();
describe('AddThreadCommandHandler', () => {
  let mockThreadRepo: ThreadRepository;
  let commandHandler: AddThreadCommandHandler;

  beforeAll(() => {
    mockThreadRepo = new MockThreadRepository();
    commandHandler = new AddThreadCommandHandler(
      mockThreadRepo,
      () => 'thread-001',
    );
  });

  it('should handle add thread correctly', async () => {
    mockThreadRepo.add = jest.fn().mockResolvedValue(undefined);

    const calledThread = Thread.create(
      new ThreadId('thread-001'),
      new UserId('user-id'),
      'Sebuah thread',
      'Isi thread',
    );

    const command = new AddThreadCommand(
      'Sebuah thread',
      'Isi thread',
      'user-id',
    );
    const result = await commandHandler.handle(command);

    expect(result).toStrictEqual(
      new AddedThreadReport('thread-001', 'Sebuah thread', 'user-id'),
    );

    expect(mockThreadRepo.add).toHaveBeenCalledWith(calledThread);
  });
});
