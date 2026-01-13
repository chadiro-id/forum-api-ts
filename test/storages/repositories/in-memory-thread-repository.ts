import { Thread, ThreadId } from '../../../src/domain/threads/entities/thread';
import { ThreadRepository } from '../../../src/domain/threads/thread-repository.interface';
import { FakeStorage } from '../../../src/application/common/tests/data/fake-storage-utils';

export class InMemoryThreadRepository implements ThreadRepository {
  private threadList: Array<Thread>;

  constructor(private storage: FakeStorage = new Map()) {
    this.threadList = (this.storage.get('threads') as Thread[]) || [];
  }

  async add(thread: Thread): Promise<void> {
    this.threadList.push(thread);
  }

  async existsById(id: ThreadId): Promise<boolean> {
    const thread = this.threadList.find((item) => item.id.equals(id));
    return thread !== undefined;
  }
}
