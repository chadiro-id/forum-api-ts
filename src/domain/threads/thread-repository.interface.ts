import { Thread, ThreadId } from './entities/thread';

export interface ThreadRepository {
  add(thread: Thread): Promise<void>;
  existsById(id: ThreadId): Promise<boolean>;
}
