import {
  ThreadDetails,
  CommentDetails,
  ReplyDetails,
} from '@main/application/threads/query/results/thread-details.result';
import { CommentId } from '@main/domain/comments/comment';
import { ThreadId } from '@main/domain/threads/entities/thread';
import { ThreadDetailsQueryService } from '../../../threads/interfaces/thread-details-query-service.interface';

export class InMemoryThreadDetailsQueryService implements ThreadDetailsQueryService {
  getById(_id: ThreadId): Promise<ThreadDetails | null> {
    throw new Error('Method not implemented.');
  }

  getCommentsById(_id: ThreadId): Promise<CommentDetails[]> {
    throw new Error('Method not implemented.');
  }

  getRepliesByCommentIds(_ids: CommentId[]): Promise<ReplyDetails[]> {
    throw new Error('Method not implemented.');
  }
}
