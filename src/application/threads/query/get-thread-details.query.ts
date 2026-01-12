import { ThreadId } from '../../../domain/threads/thread';

export class GetThreadDetailsQuery {
  constructor(public readonly id: ThreadId) {}
}
