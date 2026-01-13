import { EntityId } from '@main/domain/common/domain-entity';
import { Comment, CommentId } from '@main/domain/comments/entities/comment';
import { CommentRepository } from '@main/domain/comments/comment-repository.interface';

export class InMemoryCommentRepository implements CommentRepository {
  constructor(private storage: Array<Comment> = []) {}

  async add(comment: Comment): Promise<void> {
    this.storage.push(comment);
  }

  async findById(id: CommentId): Promise<Comment | null> {
    const comment = this.storage.find((c) => c.id.equals(id));
    return comment ? comment : null;
  }

  async existsBy(criteria: Partial<Comment>): Promise<boolean> {
    const comment = this.storage.find((c) => {
      for (const [k, v] of Object.entries(criteria)) {
        if (c[k] instanceof EntityId && !c[k].equals(v)) {
          return false;
        } else if (c[k] !== v) {
          return false;
        }
      }
      return true;
    });
    return comment !== undefined;
  }

  async softDelete(comment: Comment): Promise<void> {
    const item = this.storage.find((c) => c.id.equals(comment.id));
    if (item) {
      const newItem = Comment.create(
        item.id,
        item.threadId,
        item.ownerId,
        item.content,
        true,
        item.createdAt,
      );

      const idx = this.storage.findIndex((c) => c.equals(item));
      this.storage[idx] = newItem;
    }
  }
}
