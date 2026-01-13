import { DomainEntity, EntityId } from '../../common/domain-entity';
import { DomainError } from '../../common/domain-error';
import { ThreadId } from '../../threads/entities/thread';
import { UserId } from '../../users/entities/user';

export class CommentId extends EntityId {
  readonly __brand = 'CommentId';

  constructor(value: string) {
    if (!value || typeof value !== 'string') {
      throw new DomainError(
        'ID must be non-empty string',
        'INVALID_COMMENT_ID',
      );
    }
    super(value);
  }
}

export class Comment extends DomainEntity<CommentId> {
  public readonly threadId: ThreadId;
  public readonly ownerId: UserId;
  public readonly content: string;
  public readonly isDelete: boolean;
  public readonly createdAt: Date;

  private constructor(
    id: CommentId,
    threadId: ThreadId,
    ownerId: UserId,
    content: string,
    isDelete: boolean,
    createdAt: Date,
  ) {
    super(id);

    this.threadId = threadId;
    this.ownerId = ownerId;
    this.content = content;
    this.isDelete = isDelete;
    this.createdAt = createdAt;
  }

  static create(
    id: CommentId,
    threadId: ThreadId,
    ownerId: UserId,
    content: string,
    isDelete: boolean = false,
    createdAt: Date = new Date(),
  ) {
    return new Comment(id, threadId, ownerId, content, isDelete, createdAt);
  }
}
