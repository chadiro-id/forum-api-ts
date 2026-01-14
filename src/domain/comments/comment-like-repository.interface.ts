import { CommentLike, CommentLikeId } from './entities/comment-like';

export interface CommentLikeRepository {
  add(entity: CommentLike): Promise<CommentLikeId>;
  find(criteria: Partial<CommentLike>): Promise<CommentLike | null>;
  delete(entity: CommentLike): Promise<void>;
}
