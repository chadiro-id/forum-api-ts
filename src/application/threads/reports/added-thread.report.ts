import { Thread } from '../../../domain/threads/thread';

export class AddedThreadReport {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly owner: string,
  ) {}

  static fromEntity(thread: Thread) {
    return new AddedThreadReport(
      thread.id.value,
      thread.title,
      thread.ownerId.value,
    );
  }
}
