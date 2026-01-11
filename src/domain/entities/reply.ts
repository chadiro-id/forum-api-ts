import { DomainEntity, EntityId } from '../common/domain-entity';
import { DomainError } from '../common/domain-error';
import { CommentId } from './comment';
import { ThreadId } from './thread';
import { UserId } from './user';

export class ReplyId extends EntityId {
  readonly __brand = 'ReplyId';

  constructor(value: string) {
    if (!value || typeof value !== 'string') {
      throw new DomainError('ID must be non-empty string', 'INVALID_REPLY_ID');
    }
    super(value);
  }
}

export class Reply extends DomainEntity<ReplyId> {
  public readonly threadId: ThreadId;
  public readonly commentId: CommentId;
  public readonly ownerId: UserId;
  public readonly content: string;
  public readonly isDelete: boolean;
  public readonly createdAt: Date;

  private constructor(
    id: ReplyId,
    threadId: ThreadId,
    commentId: CommentId,
    ownerId: UserId,
    content: string,
    isDelete: boolean,
    createdAt: Date,
  ) {
    super(id);

    this.threadId = threadId;
    this.commentId = commentId;
    this.ownerId = ownerId;
    this.content = content;
    this.isDelete = isDelete;
    this.createdAt = createdAt;
  }

  static create(
    id: ReplyId,
    threadId: ThreadId,
    commentId: CommentId,
    ownerId: UserId,
    content: string,
    isDelete: boolean = false,
    createdAt: Date = new Date(),
  ) {
    return new Reply(
      id,
      threadId,
      commentId,
      ownerId,
      content,
      isDelete,
      createdAt,
    );
  }
}
