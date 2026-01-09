import { Reply, ReplyId } from '../entities/reply';

export interface ReplyRepository {
  add(reply: Reply): Promise<void>;
  findById(id: ReplyId): Promise<Reply | null>;
  updateById(id: ReplyId, changes: Partial<Reply>): Promise<void>;
}
