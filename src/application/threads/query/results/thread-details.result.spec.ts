import { ThreadId } from '@main/domain/threads/thread';
import {
  CommentDetails,
  ReplyDetails,
  ThreadDetails,
} from './thread-details.result';
import { CommentId } from '@main/domain/comments/comment';
import { ReplyId } from '@main/domain/replies/reply';

describe('ThreadDetailsResult', () => {
  describe('ThreadDetails', () => {
    it('should correctly initialize data', () => {
      const id = new ThreadId('thread-001');
      const date = new Date();

      const thread = new ThreadDetails(
        id,
        'Sebuah thread',
        'Isi thread',
        'johndoe',
        date,
      );

      expect(thread.id).toStrictEqual(id);
      expect(thread.title).toBe('Sebuah thread');
      expect(thread.body).toBe('Isi thread');
      expect(thread.username).toBe('johndoe');
      expect(thread.createdAt).toStrictEqual(date);
    });
  });

  describe('CommentDetails', () => {
    it('should correctly initialize data', () => {
      const id = new CommentId('comment-001');
      const date = new Date();

      const comment = new CommentDetails(
        id,
        'Sebuah komentar',
        'johndoe',
        false,
        date,
      );

      expect(comment.id).toStrictEqual(id);
      expect(comment.content).toBe('Sebuah komentar');
      expect(comment.username).toBe('johndoe');
      expect(comment.isDelete).toBe(false);
      expect(comment.createdAt).toStrictEqual(date);
    });
  });

  describe('ReplyDetails', () => {
    it('should correctly initialize data', () => {
      const id = new ReplyId('reply-001');
      const commentId = new CommentId('comment-001');
      const date = new Date();

      const reply = new ReplyDetails(
        id,
        commentId,
        'johndoe',
        'Sebuah balasan',
        false,
        date,
      );

      expect(reply.id).toStrictEqual(id);
      expect(reply.commentId).toStrictEqual(commentId);
      expect(reply.content).toBe('Sebuah balasan');
      expect(reply.username).toBe('johndoe');
      expect(reply.isDelete).toBe(false);
      expect(reply.createdAt).toStrictEqual(date);
    });
  });
});
