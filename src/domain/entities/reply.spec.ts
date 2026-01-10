import { DomainError } from '../common/domain-error';
import { CommentId } from './comment';
import { Reply, ReplyId } from './reply';
import { ThreadId } from './thread';
import { UserId } from './user';

describe('ReplyId', () => {
  it('should create instance with valid value', () => {
    const id = new ReplyId('reply-123');

    expect(id.__brand).toBe('ReplyId');
    expect(id.value).toBe('reply-123');
  });

  it('should throw error when value is not valid', () => {
    const notString = 123 as unknown as string;

    expect(() => new ReplyId(notString)).toThrow(DomainError);
    expect(() => new ReplyId('')).toThrow('ID must be non-empty string');
  });
});

describe('Reply Entity', () => {
  const id = new ReplyId('reply-123');
  const threadId = new ThreadId('thread-123');
  const commentId = new CommentId('comment-123');
  const ownerId = new UserId('user-123');
  const content = 'Sebuah balasan';
  const creationDate = new Date();

  describe('create', () => {
    it('should initialize with valid data', () => {
      const reply = Reply.create(
        id,
        threadId,
        commentId,
        ownerId,
        content,
        false,
        creationDate,
      );

      expect(reply.id).toStrictEqual(id);
      expect(reply.threadId).toStrictEqual(threadId);
      expect(reply.commentId).toStrictEqual(commentId);
      expect(reply.ownerId).toStrictEqual(ownerId);
      expect(reply.content).toBe(content);
      expect(reply.isDelete).toBe(false);
      expect(reply.createdAt).toStrictEqual(creationDate);
    });

    it('should have default value isDelete "false" and creation date', () => {
      const reply = Reply.create(id, threadId, commentId, ownerId, content);

      const timeDiff = Math.abs(Date.now() - reply.createdAt.getTime());

      expect(reply.isDelete).toBe(false);
      expect(timeDiff < 10000).toBe(true);
    });
  });
});
