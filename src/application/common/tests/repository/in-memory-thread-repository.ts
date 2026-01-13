import { Thread, ThreadId } from '../../../../domain/threads/entities/thread';
import { ThreadRepository } from '../../../../domain/threads/thread-repository.interface';
import { FakeStorage } from '../data/fake-storage-utils';

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
