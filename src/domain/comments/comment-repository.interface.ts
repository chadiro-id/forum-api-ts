import { Comment, CommentId } from './entities/comment';

export interface CommentRepository {
  add(comment: Comment): Promise<void>;
  findById(id: CommentId): Promise<Comment | null>;
  existsBy(criteria: Partial<Comment>): Promise<boolean>;
  softDelete(comment: Comment): Promise<void>;
}
