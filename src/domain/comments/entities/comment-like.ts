import { DomainError } from '@main/domain/common/domain-error';
import { DomainEntity, EntityId } from '@main/domain/common/domain-entity';
import { CommentId } from './comment';
import { UserId } from '@main/domain/users/entities/user';

export class CommentLikeId extends EntityId<number> {
  readonly __brand = 'CommentLikeId';

  constructor(value: number | null = null) {
    if (value !== null) {
      if (typeof value !== 'number' || value < 1) {
        throw new DomainError(
          'ID must be non-negative integer',
          'INVALID_COMMENT_LIKE_ID',
        );
      }
    }
    super(value);
  }
}

export class CommentLike extends DomainEntity<CommentLikeId> {
  public readonly commentId: CommentId;
  public readonly userId: UserId;

  private constructor(id: CommentLikeId, commentId: CommentId, userId: UserId) {
    super(id);
    this.commentId = commentId;
    this.userId = userId;
  }

  static create(commentId: CommentId, userId: UserId) {
    const id = new CommentLikeId();
    return new CommentLike(id, commentId, userId);
  }

  static restore(id: CommentLikeId, commentId: CommentId, userId: UserId) {
    if (!id.value) {
      throw new DomainError('Invalid ID', 'COMMENT_LIKE_RESTORE');
    }
    return new CommentLike(id, commentId, userId);
  }

  assignId(id: CommentLikeId) {
    if (this._id.value) {
      throw new DomainError('ID already assigned', 'COMMENT_LIKE_ASSIGN_ID');
    }

    if (!id.value) {
      throw new DomainError(
        'Cannot assign id with null value',
        'COMMENT_LIKE_ASSIGN_ID',
      );
    }
    this._id = id;
  }
}
