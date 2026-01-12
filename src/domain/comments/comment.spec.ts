import { DomainError } from '../common/domain-error';
import { Comment, CommentId } from './comment';
import { ThreadId } from '../threads/thread';
import { UserId } from '../users/user';

describe('CommentId', () => {
  it('should create instance with valid value', () => {
    const id = new CommentId('comment-123');

    expect(id.__brand).toBe('CommentId');
    expect(id.value).toBe('comment-123');
  });

  it('should throw error when value is not valid', () => {
    const notString = 123 as unknown as string;

    expect(() => new CommentId(notString)).toThrow(DomainError);
    expect(() => new CommentId('')).toThrow('ID must be non-empty string');
  });
});

describe('Comment Entity', () => {
  const id = new CommentId('comment-123');
  const threadId = new ThreadId('thread-123');
  const ownerId = new UserId('user-123');
  const content = 'Sebuah komentar';
  const creationDate = new Date();

  describe('create', () => {
    it('should initialize with valid data', () => {
      const comment = Comment.create(
        id,
        threadId,
        ownerId,
        content,
        false,
        creationDate,
      );

      expect(comment.id).toStrictEqual(id);
      expect(comment.threadId).toStrictEqual(threadId);
      expect(comment.ownerId).toStrictEqual(ownerId);
      expect(comment.content).toBe(content);
      expect(comment.isDelete).toBe(false);
      expect(comment.createdAt).toStrictEqual(creationDate);
    });

    it('should have default value isDelete "false" and creation date', () => {
      const comment = Comment.create(id, threadId, ownerId, content);

      const timeDiff = Math.abs(Date.now() - comment.createdAt.getTime());

      expect(comment.isDelete).toBe(false);
      expect(timeDiff < 10000).toBe(true);
    });
  });
});
