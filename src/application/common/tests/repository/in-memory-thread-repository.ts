import { Thread, ThreadId } from '../../../../domain/entities/thread';
import { ThreadRepository } from '../../../../domain/repositories/thread-repository.interface';

export class InMemoryThreadRepository implements ThreadRepository {
  private storage: Array<Thread>;

  constructor() {
    this.storage = [];
  }

  async add(thread: Thread): Promise<void> {
    this.storage.push(thread);
  }

  async existsById(id: ThreadId): Promise<boolean> {
    const thread = this.storage.find((item) => item.id.equals(id));
    return thread !== undefined;
  }
}
