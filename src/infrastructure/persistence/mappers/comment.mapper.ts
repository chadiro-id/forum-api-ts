import { ThreadId } from '../../../domain/threads/thread';
import { Comment, CommentId } from '../../../domain/comments/comment';
import { CommentDetails } from '../../../application/threads/query/results/thread-details.result';
import { UserId } from '../../../domain/entities/user';

export interface CommentRow {
  id: string;
  thread_id: string;
  owner_id: string;
  content: string;
  is_delete: boolean;
  created_at: Date;
}
export class CommentMapper {
  static toDomain(row: CommentRow) {
    const id = new CommentId(row.id);
    const threadId = new ThreadId(row.thread_id);
    const ownerId = new UserId(row.owner_id);

    return Comment.create(
      id,
      threadId,
      ownerId,
      row.content,
      row.is_delete,
      row.created_at,
    );
  }

  static toPersistence(entity: Partial<Comment>) {
    return {
      id: entity.id?.value,
      thread_id: entity.threadId?.value,
      owner_id: entity.ownerId?.value,
      content: entity.content,
      is_delete: entity.isDelete,
      created_at: entity.createdAt,
    };
  }
}

export interface CommentDetailsRow {
  id: string;
  content: string;
  username: string;
  is_delete: boolean;
  created_at: Date;
}
export class CommentDetailsMapper {
  static toDomain(row: CommentDetailsRow) {
    const id = new CommentId(row.id);
    return new CommentDetails(
      id,
      row.content,
      row.username,
      row.is_delete,
      row.created_at,
    );
  }
}
