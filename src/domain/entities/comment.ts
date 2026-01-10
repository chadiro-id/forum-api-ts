import { DomainEntity, EntityId } from '../common/domain-entity';
import { DomainError } from '../common/domain-error';
import { AccessRightsError } from '../errors/access-rights.error';
import { AlreadyDeletedError } from '../errors/already-deleted.error';
import { DeceptiveAccessError } from '../errors/deceptive-access.error';
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
  private _isDelete: boolean;

  private constructor(
    id: CommentId,
    public readonly threadId: ThreadId,
    public readonly ownerId: UserId,
    public readonly content: string,
    isDelete: boolean,
    public readonly createdAt: Date,
  ) {
    super(id);

    this._isDelete = isDelete;
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

  get isDelete() {
    return this._isDelete;
  }

  markAsDeleted() {
    if (this._isDelete) {
      throw new AlreadyDeletedError('Cannot delete comment');
    }
    this._isDelete = true;
  }

  verifyNonDeceptiveAccess(threadId: ThreadId) {
    if (!this.threadId.equals(threadId)) {
      throw new DeceptiveAccessError(
        'Cannot access comment',
        'THREAD_ID_NOT_MATCH',
      );
    }
  }

  verifyAccessRights(userId: UserId) {
    if (!this.ownerId.equals(userId)) {
      throw new AccessRightsError(
        'Request id do not have access rights',
        'USER_ID_NOT_MATCH_OWNER',
      );
    }
  }
}
