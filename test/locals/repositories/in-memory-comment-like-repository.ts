import { CommentLikeRepository } from '@main/domain/comments/comment-like-repository.interface';
import {
  CommentLike,
  CommentLikeId,
} from '@main/domain/comments/entities/comment-like';
import { EntityStorage } from '../entity-storage';

export class InMemoryCommentLikeRepository implements CommentLikeRepository {
  private increment = 0;
  private commentLikeList: Array<CommentLike>;

  constructor(private storage: EntityStorage) {
    this.commentLikeList =
      (this.storage.get('comment_likes') as CommentLike[]) || [];
  }

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
