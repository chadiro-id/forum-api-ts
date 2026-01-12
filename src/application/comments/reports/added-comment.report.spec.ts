import { AddedCommentReport } from './added-comment.report';

describe('AddedCommentReport', () => {
  it('should initialize with valid data', () => {
    const report = new AddedCommentReport(
      'comment-id',
      'Sebuah komentar',
      'user-id',
    );

    expect(report.id).toBe('comment-id');
    expect(report.content).toBe('Sebuah komentar');
    expect(report.owner).toBe('user-id');
  });
});
