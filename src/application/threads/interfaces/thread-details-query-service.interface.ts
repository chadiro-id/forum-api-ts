import { CommentId } from '@main/domain/comments/comment';
import { ThreadId } from '../../../domain/entities/thread';
import {
  CommentDetails,
  ReplyDetails,
  ThreadDetails,
} from '../query/results/thread-details.result';

export interface ThreadDetailsQueryService {
  getById(id: ThreadId): Promise<ThreadDetails | null>;
  getCommentsById(id: ThreadId): Promise<CommentDetails[]>;
  getRepliesByCommentIds(ids: CommentId[]): Promise<ReplyDetails[]>;
}
