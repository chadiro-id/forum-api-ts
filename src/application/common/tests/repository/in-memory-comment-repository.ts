import { EntityId } from '@main/domain/common/domain-entity';
import { Comment, CommentId } from '@main/domain/comments/entities/comment';
import { CommentRepository } from '@main/domain/comments/comment-repository.interface';
import { FakeStorage } from '../data/fake-storage-utils';

export class InMemoryCommentRepository implements CommentRepository {
  private commentList: Array<Comment>;

  constructor(private storage: FakeStorage = new Map()) {
    this.commentList = (this.storage.get('comments') as Comment[]) || [];
  }

  async add(comment: Comment): Promise<void> {
    this.commentList.push(comment);
  }

  async findById(id: CommentId): Promise<Comment | null> {
    const comment = this.commentList.find((c) => c.id.equals(id));
    return comment ? comment : null;
  }

  async existsBy(criteria: Partial<Comment>): Promise<boolean> {
    const comment = this.commentList.find((c) => {
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
    const item = this.commentList.find((c) => c.id.equals(comment.id));
    if (item) {
      const newItem = Comment.create(
        item.id,
        item.threadId,
        item.ownerId,
        item.content,
        true,
        item.createdAt,
      );

      const idx = this.commentList.findIndex((c) => c.equals(item));
      this.commentList[idx] = newItem;
    }
  }
}
