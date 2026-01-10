import { DomainEntity, EntityId } from '../common/domain-entity';
import { DomainError } from '../common/domain-error';
import { AccessRightsError } from '../errors/access-rights.error';
import { AlreadyDeletedError } from '../errors/already-deleted.error';
import { DeceptiveAccessError } from '../errors/deceptive-access.error';
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
  private _isDelete: boolean;

  private constructor(
    id: ReplyId,
    public readonly threadId: ThreadId,
    public readonly commentId: CommentId,
    public readonly ownerId: UserId,
    public readonly content: string,
    isDelete: boolean,
    public readonly createdAt: Date,
  ) {
    super(id);

    this._isDelete = isDelete;
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

  get isDelete() {
    return this._isDelete;
  }

  markAsDeleted() {
    if (this.isDelete) {
      throw new AlreadyDeletedError('Cannot delete reply');
    }
    this._isDelete = true;
  }

  verifyNonDeceptiveAccess(threadId: ThreadId, commentId: CommentId) {
    if (!this.threadId.equals(threadId) || !this.commentId.equals(commentId)) {
      throw new DeceptiveAccessError(
        'Cannot access reply',
        'RELATED_ID_NOT_MATCH',
      );
    }
  }

  verifyAccessRights(userId: UserId) {
    if (!this.ownerId.equals(userId)) {
      throw new AccessRightsError(
        'Request id does not have access rights',
        'USER_ID_NOT_MATCH_OWNER',
      );
    }
  }
}
