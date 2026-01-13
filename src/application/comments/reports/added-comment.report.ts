import { Comment } from '../../../domain/comments/entities/comment';

export class AddedCommentReport {
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly owner: string,
  ) {}

  static fromEntity(comment: Comment) {
    return new AddedCommentReport(
      comment.id.value,
      comment.content,
      comment.ownerId.value,
    );
  }
}
