import { Reply, ReplyId } from '@main/domain/replies/entities/reply';
import { ReplyRepository } from '@main/domain/replies/reply-repository.interface';

export class InMemoryReplyRepository implements ReplyRepository {
  constructor(private storage: Array<Reply> = []) {}

  async add(reply: Reply): Promise<void> {
    this.storage.push(reply);
  }

  async findById(id: ReplyId): Promise<Reply | null> {
    const item = this.storage.find((r) => r.id.equals(id));
    return item ? item : null;
  }

  async softDelete(reply: Reply): Promise<void> {
    const item = this.storage.find((r) => r.id.equals(reply.id));
    if (!item) return;

    const newItem = Reply.create(
      item.id,
      item.threadId,
      item.commentId,
      item.ownerId,
      item.content,
      true,
      item.createdAt,
    );

    const idx = this.storage.findIndex((c) => c.equals(item));
    this.storage[idx] = newItem;
  }
}
