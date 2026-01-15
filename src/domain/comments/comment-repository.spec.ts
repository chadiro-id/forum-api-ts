import { ThreadId } from '../threads/entities/thread';
import { UserId } from '../users/entities/user';
import { Comment, CommentId } from './entities/comment';
import { MockCommentRepository } from './comment-repository.mock';

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

    const exists = await repo.existsBy({
      id: entity.id,
      content: 'Sebuah komentar',
    });
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
