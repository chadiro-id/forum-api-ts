import { Reply, ReplyId } from '@main/domain/replies/entities/reply';
import { AddedReplyReport } from './added-reply.report';
import { ThreadId } from '@main/domain/threads/entities/thread';
import { CommentId } from '@main/domain/comments/entities/comment';
import { UserId } from '@main/domain/users/entities/user';

describe('AddedReplyReport', () => {
  it('should correctly initialize data', () => {
    const report = new AddedReplyReport(
      'reply-id',
      'Sebuah balasan',
      'user-id',
    );

    expect(report.id).toBe('reply-id');
    expect(report.content).toBe('Sebuah balasan');
    expect(report.owner).toBe('user-id');
  });

  describe('fromEntity', () => {
    it('should initialize data from Reply', () => {
      const entity = Reply.create(
        new ReplyId('reply-id'),
        new ThreadId('thread-id'),
        new CommentId('comment-id'),
        new UserId('user-id'),
        'Sebuah balasan',
      );

      const report = AddedReplyReport.fromEntity(entity);
      expect(report).toStrictEqual(
        new AddedReplyReport('reply-id', 'Sebuah balasan', 'user-id'),
      );
    });
  });
});
