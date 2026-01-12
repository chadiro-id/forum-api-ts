import { Thread, ThreadId } from '@main/domain/threads/thread';
import { AddedThreadReport } from './added-thread.report';
import { UserId } from '@main/domain/users/user';

describe('AddedThreadReport', () => {
  it('should correctly initialize data', () => {
    const report = new AddedThreadReport(
      'thread-id',
      'Sebuah thread',
      'user-id',
    );

    expect(report.id).toBe('thread-id');
    expect(report.title).toBe('Sebuah thread');
    expect(report.owner).toBe('user-id');
  });

  describe('fromEntity', () => {
    it('should correctly initialize data from Thread', () => {
      const thread = Thread.create(
        new ThreadId('thread-id'),
        new UserId('user-id'),
        'Sebuah thread',
        'Isi thread',
      );

      const report = AddedThreadReport.fromEntity(thread);
      expect(report).toStrictEqual(
        new AddedThreadReport('thread-id', 'Sebuah thread', 'user-id'),
      );
    });
  });
});
