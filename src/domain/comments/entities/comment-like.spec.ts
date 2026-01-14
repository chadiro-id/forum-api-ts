import { DomainError } from '@main/domain/common/domain-error';
import { CommentLike, CommentLikeId } from './comment-like';
import { CommentId } from './comment';
import { UserId } from '@main/domain/users/entities/user';

describe('CommentLikeId', () => {
  it('should initialize with valid value', () => {
    const id = new CommentLikeId(1);

    expect(id.__brand).toBe('CommentLikeId');
    expect(id.value).toBe(1);
  });

  it('should have default value null', () => {
    const id = new CommentLikeId();
    expect(id.value).toBeNull();
  });

  it('should throw error when value not valid', () => {
    const notNumber = '123' as unknown as number;
    const notNull = [] as unknown as null;

    expect(() => new CommentLikeId(notNumber)).toThrow(DomainError);
    expect(() => new CommentLikeId(notNull)).toThrow(DomainError);
  });

  it('should throw error when value is less than 1', () => {
    expect(() => new CommentLikeId(0)).toThrow(DomainError);
  });
});

describe('CommentLike Entity', () => {
  describe('create', () => {
    it('should create Comment with valid data', () => {
      const commentId = new CommentId('comment-id');
      const userId = new UserId('user-id');

      const commentLike = CommentLike.create(commentId, userId);

      expect(commentLike.id).toStrictEqual(new CommentLikeId());
      expect(commentLike.commentId).toStrictEqual(commentId);
      expect(commentLike.userId).toStrictEqual(userId);
    });
  });

  describe('restore', () => {
    it('should restore with valid data', () => {
      const id = new CommentLikeId(10);
      const commentId = new CommentId('comment-id');
      const userId = new UserId('user-id');

      const commentLike = CommentLike.restore(id, commentId, userId);

      expect(commentLike.id).toStrictEqual(id);
      expect(commentLike.commentId).toStrictEqual(commentId);
      expect(commentLike.userId).toStrictEqual(userId);
    });

    it('should throw error when id has null value', () => {
      const id = new CommentLikeId();
      const commentId = new CommentId('comment-id');
      const userId = new UserId('user-id');

      expect(() => CommentLike.restore(id, commentId, userId)).toThrow(
        'Invalid ID',
      );
    });
  });

  describe('assignId', () => {
    it('should correctly assign the given Id', () => {
      const commentLike = CommentLike.create(
        new CommentId('id'),
        new UserId('id'),
      );

      commentLike.assignId(new CommentLikeId(1));
      expect(commentLike.id.value).toBe(1);
    });

    it('should throw error when id already assigned', () => {
      const commentLike = CommentLike.restore(
        new CommentLikeId(1),
        new CommentId('id'),
        new UserId('id'),
      );

      expect(() => commentLike.assignId(new CommentLikeId(10))).toThrow(
        'ID already assigned',
      );
    });

    it('should throw error when the given Id has null value', () => {
      const commentLike = CommentLike.create(
        new CommentId('id'),
        new UserId('id'),
      );
      expect(() => commentLike.assignId(new CommentLikeId())).toThrow(
        'Cannot assign id with null value',
      );
    });
  });
});
