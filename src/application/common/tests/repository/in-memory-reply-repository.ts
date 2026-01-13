import { Reply, ReplyId } from '@main/domain/replies/entities/reply';
import { ReplyRepository } from '@main/domain/replies/reply-repository.interface';
import { FakeStorage } from '../data/fake-storage-utils';

export class InMemoryReplyRepository implements ReplyRepository {
  private replyList: Array<Reply>;

  constructor(private storage: FakeStorage = new Map()) {
    this.replyList = (this.storage.get('replies') as Reply[]) || [];
  }

  async add(reply: Reply): Promise<void> {
    this.replyList.push(reply);
  }

  async findById(id: ReplyId): Promise<Reply | null> {
    const item = this.replyList.find((r) => r.id.equals(id));
    return item ? item : null;
  }

  async softDelete(reply: Reply): Promise<void> {
    const item = this.replyList.find((r) => r.id.equals(reply.id));
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

    const idx = this.replyList.findIndex((c) => c.equals(item));
    this.replyList[idx] = newItem;
  }
}
