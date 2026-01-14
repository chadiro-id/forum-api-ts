import { Comment, CommentId } from '@main/domain/comments/entities/comment';
import { CommentRepository } from '@main/domain/comments/comment-repository.interface';
import { EntityStorage } from '../entity-storage';

export class InMemoryCommentRepository implements CommentRepository {
  private commentList: Array<Comment>;

  constructor(private storage: EntityStorage) {
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
    const comments = this.commentList.filter((c) =>
      Object.keys(criteria).every((k) =>
        c[k].equals ? c[k].equals(criteria[k]) : c[k] === criteria[k],
      ),
    );
    return comments.length > 0;
  }

  async softDelete(comment: Comment): Promise<void> {
    const idx = this.commentList.findIndex((c) => c.equals(comment));
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
