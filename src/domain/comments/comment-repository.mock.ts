import { CommentRepository } from './comment-repository.interface';
import { Comment, CommentId } from './entities/comment';
import { EntityId } from '../common/domain-entity';

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
