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
  public readonly threadId: ThreadId;
  public readonly ownerId: UserId;
  public readonly content: string;
  public readonly createdAt: Date;

  private _isDelete: boolean;

  constructor(
    id: CommentId,
    threadId: ThreadId,
    ownerId: UserId,
    content: string,
    isDelete: boolean,
    createdAt: Date,
  ) {
    super(id);
    this.threadId = this.validateThreadId(threadId);
    this.ownerId = this.validateOwnerId(ownerId);
    this.content = this.validateContent(content);
    this.createdAt = this.validateCreatedAt(createdAt);

    this._isDelete = this.validateIsDelete(isDelete);
  }

  static create(
    id: CommentId,
    threadId: ThreadId,
    ownerId: UserId,
    content: string,
  ) {
    const date = new Date();
    return new Comment(id, threadId, ownerId, content, false, date);
  }

  get isDelete() {
    return this._isDelete;
  }

  private validateThreadId(value: unknown): ThreadId {
    if (value instanceof ThreadId === false) {
      throw new DomainError(undefined, 'COMMENT_INVALID_THREAD_ID');
    }
    return value;
  }

  private validateOwnerId(value: unknown): UserId {
    if (value instanceof UserId === false) {
      throw new DomainError(undefined, 'COMMENT_INVALID_OWNER_ID');
    }
    return value;
  }

  private validateContent(value: unknown): string {
    if (!value || typeof value !== 'string') {
      throw new DomainError('Content cannot empty', 'COMMENT_INVALID_CONTENT');
    }
    return value;
  }

  private validateCreatedAt(value: unknown): Date {
    if (
      value instanceof Date === false ||
      Number.isNaN(Date.parse(value.toString()))
    ) {
      throw new DomainError(undefined, 'INVALID_CREATION_DATE');
    }
    return value;
  }

  private validateIsDelete(value: unknown): boolean {
    if (typeof value !== 'boolean') {
      throw new DomainError(
        'Is delete value must be boolean',
        'INVALID_COMMENT_IS_DELETE',
      );
    }
    return value;
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
