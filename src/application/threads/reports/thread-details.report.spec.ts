import { ThreadId } from '@main/domain/threads/thread';
import {
  CommentDetails,
  ReplyDetails,
  ThreadDetails,
} from '../query/results/thread-details.result';
import { ThreadDetailsReport } from './thread-details.report';
import { CommentId } from '@main/domain/comments/comment';
import { ReplyId } from '@main/domain/replies/reply';

describe('ThreadDetailsReport', () => {
  it('should correctly initialize data', () => {
    const date = new Date();

    const report = new ThreadDetailsReport(
      'thread-001',
      'Sebuah thread',
      'Isi thread',
      date.toISOString(),
      'johndoe',
      [],
    );

    expect(report.id).toBe('thread-001');
    expect(report.title).toBe('Sebuah thread');
    expect(report.body).toBe('Isi thread');
    expect(report.date).toBe(date.toISOString());
    expect(report.username).toBe('johndoe');
    expect(report.comments).toStrictEqual([]);
  });

  describe('fromQuery', () => {
    it('should handle data from ThreadDetails', () => {
      const thread = createThreadDetails('thread-001');

      const report = ThreadDetailsReport.fromQuery(thread);
      expect(report).toStrictEqual(
        new ThreadDetailsReport(
          thread.id.value,
          thread.title,
          thread.body,
          thread.createdAt.toISOString(),
          thread.username,
          [],
        ),
      );
    });

    it('should handle thread with comments', () => {
      const thread = createThreadDetails('thread-001');
      const commentA = createCommentDetails('comment-001', false);
      const commentB = createCommentDetails('comment-002', true);

      const report = ThreadDetailsReport.fromQuery(thread, [
        commentA,
        commentB,
      ]);

      expect(report.comments).toStrictEqual([
        {
          id: commentA.id.value,
          content: commentA.content,
          username: commentA.username,
          date: commentA.createdAt.toISOString(),
          replies: [],
        },
        {
          id: commentB.id.value,
          content: '**komentar telah dihapus**',
          username: commentB.username,
          date: commentB.createdAt.toISOString(),
          replies: [],
        },
      ]);
    });

    it('should handle thread with comments and replies', () => {
      const thread = createThreadDetails('thread-001');
      const comment = createCommentDetails('comment-001');
      const replyA = createReplyDetails('reply-001', comment.id.value, false);
      const replyB = createReplyDetails('reply-002', comment.id.value, true);

      const report = ThreadDetailsReport.fromQuery(
        thread,
        [comment],
        [replyA, replyB],
      );

      const replies = report.comments[0].replies;
      expect(replies).toStrictEqual([
        {
          id: replyA.id.value,
          content: replyA.content,
          username: replyA.username,
          date: replyA.createdAt.toISOString(),
        },
        {
          id: replyB.id.value,
          content: '**balasan telah dihapus**',
          username: replyB.username,
          date: replyB.createdAt.toISOString(),
        },
      ]);
    });
  });
});

const createThreadDetails = (id: string = 'thread-001') =>
  new ThreadDetails(
    new ThreadId(id),
    'Sebuah thread',
    'Isi thread',
    'johndoe',
    new Date(),
  );

const createCommentDetails = (
  id: string = 'comment-100',
  isDelete: boolean = false,
) =>
  new CommentDetails(
    new CommentId(id),
    'Sebuah komentar',
    'johndoe',
    isDelete,
    new Date(),
  );

const createReplyDetails = (
  id: string = 'reply-200',
  commentId: string = 'comment-100',
  isDelete: boolean = false,
) =>
  new ReplyDetails(
    new ReplyId(id),
    new CommentId(commentId),
    'johndoe',
    'Sebuah balasan',
    isDelete,
    new Date(),
  );
