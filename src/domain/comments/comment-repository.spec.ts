import { EntityId } from '../common/domain-entity';
import { ThreadId } from '../threads/entities/thread';
import { UserId } from '../users/entities/user';
import { CommentRepository } from './comment-repository.interface';
import { Comment, CommentId } from './entities/comment';

export class MockCommentRepository implements CommentRepository {
  private commentList: Array<Comment> = [];

  async add(comment: Comment): Promise<void> {
    this.commentList.push(comment);
  }

  async findById(id: CommentId): Promise<Comment | null> {
    const found = this.commentList.find((c) => c.id.equals(id));
    return found ?? null;
  }

  async existsBy(criteria: Partial<Comment>): Promise<boolean> {
    const comments = this.commentList.filter((c) => {
      for (const [k, v] of Object.entries(criteria)) {
        if (v instanceof EntityId && c[k].equals(v)) return true;
        if (c[k] === v) return true;
      }
      return false;
    });
    return comments.length > 0;
  }

  async softDelete(comment: Comment): Promise<void> {
    const idx = this.commentList.findIndex((c) => c.equals(comment));
    if (idx < 0) return;
    this.commentList[idx] = Comment.create(
      comment.id,
      comment.threadId,
      comment.ownerId,
      comment.content,
      true,
      comment.createdAt,
    );
  }
}

describe('CommentRepository', () => {
  it('should enforce findById method', async () => {
    const repo = new MockCommentRepository();

    const found = await repo.findById(new CommentId('comment-xxx'));
    expect(found).toBeNull();
  });

  it('should enforce existsBy method', async () => {
    const repo = new MockCommentRepository();

    const exists = await repo.existsBy({ content: 'Sebuah komentar' });
    expect(exists).toBe(false);
  });

  it('should enforce add method', async () => {
    const entity = Comment.create(
      new CommentId('comment-001'),
      new ThreadId('thread-id'),
      new UserId('user-id'),
      'Sebuah komentar',
    );

    const repo = new MockCommentRepository();
    await repo.add(entity);

    const exists = await repo.existsBy({ content: 'Sebuah komentar' });
    expect(exists).toBe(true);

    const found = await repo.findById(new CommentId('comment-001'));
    expect(found).toStrictEqual(entity);
  });

  it('should enforce softDelete method', async () => {
    const entity = Comment.create(
      new CommentId('comment-001'),
      new ThreadId('thread-id'),
      new UserId('user-id'),
      'Sebuah komentar',
      false,
    );

    const repo = new MockCommentRepository();
    await repo.add(entity);

    const exists = await repo.existsBy({ isDelete: false });
    expect(exists).toBe(true);

    await repo.softDelete(entity);

    const found = await repo.findById(new CommentId('comment-001'));
    expect(found?.isDelete).toBe(true);
  });
});
