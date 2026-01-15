import { Reply, ReplyId } from './entities/reply';
import { ReplyRepository } from './reply-repository.interface';

export class MockReplyRepository implements ReplyRepository {
  private replyList: Array<Reply> = [];

  async add(reply: Reply): Promise<void> {
    this.replyList.push(reply);
  }

  async findById(id: ReplyId): Promise<Reply | null> {
    const found = this.replyList.find((r) => r.id.equals(id));
    return found ?? null;
  }

  async softDelete(reply: Reply): Promise<void> {
    const idx = this.replyList.findIndex((r) => r.equals(reply));
    this.replyList[idx] = Reply.create(
      reply.id,
      reply.threadId,
      reply.commentId,
      reply.ownerId,
      reply.content,
      true,
      reply.createdAt,
    );
  }
}
