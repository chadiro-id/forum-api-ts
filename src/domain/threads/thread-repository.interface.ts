import { Thread, ThreadId } from './thread';

export interface ThreadRepository {
  add(thread: Thread): Promise<void>;
  existsById(id: ThreadId): Promise<boolean>;
}
