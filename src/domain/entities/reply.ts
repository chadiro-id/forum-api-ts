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
  public readonly threadId: ThreadId;
  public readonly commentId: CommentId;
  public readonly ownerId: UserId;
  public readonly content: string;
  public readonly createdAt: Date;

  private _isDelete: boolean;

  constructor(
    id: ReplyId,
    threadId: ThreadId,
    commentId: CommentId,
    ownerId: UserId,
    content: string,
    isDelete: boolean,
    createdAt: Date,
  ) {
    super(id);

    this.threadId = this.validateThreadId(threadId);
    this.commentId = this.validateCommentId(commentId);
    this.ownerId = this.validateOwnerId(ownerId);
    this.content = this.validateContent(content);
    this.createdAt = this.validateCreatedAt(createdAt);

    this._isDelete = this.validateIsDelete(isDelete);
  }

  static create(
    id: ReplyId,
    threadId: ThreadId,
    commentId: CommentId,
    ownerId: UserId,
    content: string,
  ) {
    const date = new Date();
    return new Reply(id, threadId, commentId, ownerId, content, false, date);
  }

  get isDelete() {
    return this._isDelete;
  }

  private validateThreadId(value: unknown): ThreadId {
    if (value instanceof ThreadId === false) {
      throw new DomainError(undefined, 'REPLY_INVALID_THREAD_ID');
    }
    return value;
  }

  private validateCommentId(value: unknown): CommentId {
    if (value instanceof CommentId === false) {
      throw new DomainError(undefined, 'REPLY_INVALID_COMMENT_ID');
    }
    return value;
  }

  private validateOwnerId(value: unknown): UserId {
    if (value instanceof UserId === false) {
      throw new DomainError(undefined, 'REPLY_INVALID_OWNER_ID');
    }
    return value;
  }

  private validateContent(value: unknown): string {
    if (!value || typeof value !== 'string') {
      throw new DomainError(
        'Content must be non-empty string',
        'REPLY_INVALID_CONTENT',
      );
    }
    return value;
  }

  private validateCreatedAt(value: unknown): Date {
    if (
      value instanceof Date === false ||
      Number.isNaN(Date.parse(value.toString()))
    ) {
      throw new DomainError(undefined, 'REPLY_INVALID_CREATION_DATE');
    }
    return value;
  }

  private validateIsDelete(value: unknown): boolean {
    if (typeof value !== 'boolean') {
      throw new DomainError(undefined, 'REPLY_INVALID_IS_DELETE');
    }
    return value;
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
