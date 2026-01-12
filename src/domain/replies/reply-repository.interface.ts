import { Reply, ReplyId } from './reply';

export interface ReplyRepository {
  add(reply: Reply): Promise<void>;
  findById(id: ReplyId): Promise<Reply | null>;
  softDelete(reply: Reply): Promise<void>;
}
