import { ThreadId } from '../../../domain/threads/thread';

export class GetThreadDetailsQuery {
  public readonly id: ThreadId;

  constructor(id: string) {
    this.id = new ThreadId(id);
  }
}
