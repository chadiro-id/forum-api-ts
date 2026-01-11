import { DomainEntity, EntityId } from '../common/domain-entity';
import { DomainError } from '../common/domain-error';
import { ThreadId } from './thread';
import { UserId } from './user';

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
  private constructor(
    id: CommentId,
    public readonly threadId: ThreadId,
    public readonly ownerId: UserId,
    public readonly content: string,
    public readonly isDelete: boolean,
    public readonly createdAt: Date,
  ) {
    super(id);
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
