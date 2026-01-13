import { Comment, CommentId } from '@main/domain/comments/comment';
import { AddedCommentReport } from './added-comment.report';
import { ThreadId } from '@main/domain/threads/thread';
import { UserId } from '@main/domain/users/entities/user';

describe('AddedCommentReport', () => {
  it('should correctly initialize data', () => {
    const report = new AddedCommentReport(
      'comment-id',
      'Sebuah komentar',
      'user-id',
    );

    expect(report.id).toBe('comment-id');
    expect(report.content).toBe('Sebuah komentar');
    expect(report.owner).toBe('user-id');
  });

  describe('fromEntity', () => {
    it('should initialize data from Comment', () => {
      const comment = Comment.create(
        new CommentId('comment-id'),
        new ThreadId('thread-id'),
        new UserId('user-id'),
        'Sebuah komentar',
      );

      const report = AddedCommentReport.fromEntity(comment);
      expect(report).toStrictEqual(
        new AddedCommentReport('comment-id', 'Sebuah komentar', 'user-id'),
      );
    });
  });
});
