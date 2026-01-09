import { DomainError } from '../common/domain-error';
import { Comment, CommentId } from './comment';
import { ThreadId } from './thread';
import { UserId } from './user';

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

  describe('constructor', () => {
    const comment = new Comment(
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
});
