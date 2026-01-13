import { CommentId } from '../comments/entities/comment';
import { ThreadId } from '../threads/entities/thread';
import { UserId } from '../users/entities/user';
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
    if (idx < 0) return;
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

describe('ReplyRepository', () => {
  it('should enforce findById method', async () => {
    const repo = new MockReplyRepository();

    const found = await repo.findById(new ReplyId('id'));
    expect(found).toBeNull();
  });

  it('should enforce add method', async () => {
    const entity = Reply.create(
      new ReplyId('reply-001'),
      new ThreadId('thread-id'),
      new CommentId('comment-id'),
      new UserId('user-id'),
      'Sebuah balasan',
    );
    const repo = new MockReplyRepository();
    await repo.add(entity);

    const found = await repo.findById(entity.id);
    expect(found).toStrictEqual(entity);
  });

  it('should enforce softDelete method', async () => {
    const entity = Reply.create(
      new ReplyId('reply-001'),
      new ThreadId('thread-id'),
      new CommentId('comment-id'),
      new UserId('user-id'),
      'Sebuah balasan',
      false,
    );
    const repo = new MockReplyRepository();
    await repo.add(entity);

    const found = await repo.findById(entity.id);
    expect(found?.isDelete).toBe(false);

    await repo.softDelete(found!);

    const softDeleted = await repo.findById(entity.id);
    expect(softDeleted?.isDelete).toBe(true);
  });
});
