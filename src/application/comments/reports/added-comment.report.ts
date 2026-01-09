import { Comment } from '../../../domain/entities/comment';

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

  toJSON() {
    return {
      id: this.id,
      content: this.content,
      owner: this.owner,
    };
  }
}
