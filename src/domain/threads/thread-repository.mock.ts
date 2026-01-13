import { ThreadRepository } from './thread-repository.interface';
import { Thread, ThreadId } from './entities/thread';

export class MockThreadRepository implements ThreadRepository {
  private threadList: Array<Thread> = [];

  async add(thread: Thread): Promise<void> {
    this.threadList.push(thread);
  }

  async existsById(id: ThreadId): Promise<boolean> {
    const thread = this.threadList.find((t) => t.id.equals(id));
    return thread instanceof Thread;
  }
}
