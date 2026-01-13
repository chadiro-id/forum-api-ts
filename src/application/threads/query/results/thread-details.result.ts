import { ThreadId } from '../../../../domain/threads/entities/thread';
import { CommentId } from '../../../../domain/comments/comment';
import { ReplyId } from '../../../../domain/replies/entities/reply';

export class ThreadDetails {
  constructor(
    public readonly id: ThreadId,
    public readonly title: string,
    public readonly body: string,
    public readonly username: string,
    public readonly createdAt: Date,
  ) {}
}

export class CommentDetails {
  constructor(
    public readonly id: CommentId,
    public readonly content: string,
    public readonly username: string,
    public readonly isDelete: boolean,
    public readonly createdAt: Date,
  ) {}
}

export class ReplyDetails {
  constructor(
    public readonly id: ReplyId,
    public readonly commentId: CommentId,
    public readonly username: string,
    public readonly content: string,
    public readonly isDelete: boolean,
    public readonly createdAt: Date,
  ) {}
}
