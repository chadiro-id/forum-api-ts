import { CommentId } from '@main/domain/comments/entities/comment';
import {
  CommentLike,
  CommentLikeId,
} from '@main/domain/comments/entities/comment-like';
import { UserId } from '@main/domain/users/entities/user';

export interface CommentLikeRow {
  id: string;
  comment_id: string;
  user_id: string;
}

export class CommentLikeMapper {
  static toDomain(row: CommentLikeRow) {
    const id = new CommentLikeId(parseInt(row.id));
    const commentId = new CommentId(row.comment_id);
    const userId = new UserId(row.user_id);

    return CommentLike.restore(id, commentId, userId);
  }

  static toPersistence(entity: Partial<CommentLike>) {
    return {
      id: entity.id?.value,
      comment_id: entity.commentId?.value,
      user_id: entity.userId?.value,
    };
  }
}
