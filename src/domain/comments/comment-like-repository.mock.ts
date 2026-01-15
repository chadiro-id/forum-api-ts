import { CommentLikeRepository } from './comment-like-repository.interface';
import { CommentLike, CommentLikeId } from './entities/comment-like';

export class MockCommentLikeRepository implements CommentLikeRepository {
  private increment = 0;
  private commentLikeList: Array<CommentLike> = [];

  async add(entity: CommentLike): Promise<CommentLikeId> {
    const id = new CommentLikeId(++this.increment);
    entity.assignId(id);
    this.commentLikeList.push(entity);
    return id;
  }

  async find(criteria: Partial<CommentLike>): Promise<CommentLike | null> {
    const found = this.commentLikeList.find((cl) =>
      Object.keys(criteria).every((key) => cl[key].equals(criteria[key])),
    );
    return found ?? null;
  }

  async delete(entity: CommentLike): Promise<void> {
    this.commentLikeList = this.commentLikeList.filter(
      (cl) => cl.equals(entity) === false,
    );
  }
}
