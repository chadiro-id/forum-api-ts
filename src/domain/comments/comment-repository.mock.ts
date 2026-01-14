import { CommentRepository } from './comment-repository.interface';
import { Comment, CommentId } from './entities/comment';

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
