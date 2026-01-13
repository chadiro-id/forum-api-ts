import { UserId } from '../users/entities/user';
import { Thread, ThreadId } from './entities/thread';
import { MockThreadRepository } from './thread-repository.mock';

describe('ThreadRepository', () => {
  it('should enforce existsById method', async () => {
    const repo = new MockThreadRepository();

    const exists = await repo.existsById(new ThreadId('thread-xxx'));
    expect(exists).toBe(false);
  });

  it('should enforce add method', async () => {
    const thread = Thread.create(
      new ThreadId('thread-001'),
      new UserId('user-id'),
      'Title',
      'body',
    );

    const repo = new MockThreadRepository();
    await repo.add(thread);

    const exists = await repo.existsById(new ThreadId('thread-001'));
    expect(exists).toBe(true);
  });
});
