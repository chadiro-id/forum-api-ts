import { ThreadId } from '../../../domain/entities/thread';
import { Reply, ReplyId } from '../../../domain/entities/reply';
import { ReplyDetails } from '../../../application/threads/query/results/thread-details.result';
import { CommentId } from '../../../domain/entities/comment';
import { UserId } from '../../../domain/entities/user';

export interface ReplyRow {
  id: string;
  thread_id: string;
  comment_id: string;
  owner_id: string;
  content: string;
  is_delete: boolean;
  created_at: Date;
}
export class ReplyMapper {
  static toDomain(row: ReplyRow) {
    const id = new ReplyId(row.id);
    const threadId = new ThreadId(row.thread_id);
    const commentId = new CommentId(row.comment_id);
    const ownerId = new UserId(row.owner_id);

    return new Reply(
      id,
      threadId,
      commentId,
      ownerId,
      row.content,
      row.is_delete,
      row.created_at,
    );
  }

  static toPersistence(entity: Partial<Reply>) {
    return {
      id: entity.id?.value,
      comment_id: entity.commentId?.value,
      owner_id: entity.ownerId?.value,
      content: entity.content,
      is_delete: entity.isDelete,
      created_at: entity.createdAt,
    };
  }
}

export interface ReplyDetailsRow {
  id: string;
  comment_id: string;
  username: string;
  content: string;
  is_delete: boolean;
  created_at: Date;
}
export class ReplyDetailsMapper {
  static toDomain(row: ReplyDetailsRow) {
    const id = new ReplyId(row.id);
    const commentId = new CommentId(row.comment_id);
    return new ReplyDetails(
      id,
      commentId,
      row.username,
      row.content,
      row.is_delete,
      row.created_at,
    );
  }
}
