import { UserId } from '../users/entities/user';
import { MockCommentLikeRepository } from './comment-like-repository.mock';
import { CommentId } from './entities/comment';
import { CommentLike } from './entities/comment-like';

describe('CommentLikeRepository', () => {
  it('should enforce find method', async () => {
    const repo = new MockCommentLikeRepository();

    const found = await repo.find({
      commentId: new CommentId('id'),
    });
    expect(found).toBeNull();
  });

  it('should enforce add method', async () => {
    const commentId = new CommentId('comment-id');
    const userId = new UserId('user-id');
    const entity = CommentLike.create(commentId, userId);

    const repo = new MockCommentLikeRepository();
    const id = await repo.add(entity);
    expect(id.value).not.toBeNull();

    const found = await repo.find({ commentId, userId });
    expect(found).toStrictEqual(CommentLike.restore(id, commentId, userId));
  });

  it('should enforce delete method', async () => {
    const commentId = new CommentId('comment-id');
    const userId = new UserId('user-id');
    const entity = CommentLike.create(commentId, userId);

    const repo = new MockCommentLikeRepository();
    const id = await repo.add(entity);

    const found = await repo.find({ id });
    expect(found).not.toBeNull();

    await repo.delete(CommentLike.restore(id, commentId, userId));

    const notFound = await repo.find({ id });
    expect(notFound).toBeNull();
  });
});
