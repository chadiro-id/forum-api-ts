import { Comment, CommentId } from '../entities/comment';

export interface CommentRepository {
  add(comment: Comment): Promise<void>;
  findById(id: CommentId): Promise<Comment | null>;
  updateById(id: CommentId, changes: Partial<Comment>): Promise<void>;
  existsBy(criteria: Partial<Comment>): Promise<boolean>;
}
