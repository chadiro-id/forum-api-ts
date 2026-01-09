import { ThreadId } from '../../../domain/entities/thread';

export class GetThreadDetailsQuery {
  constructor(public readonly id: ThreadId) {}
}
