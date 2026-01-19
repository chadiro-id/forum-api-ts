import {
  ThreadDetails,
  CommentDetails,
  ReplyDetails,
} from '../query/results/thread-details.result';

interface Comment {
  id: string;
  content: string;
  date: string;
  username: string;
  likeCount: number;
  replies: Reply[];
}

interface Reply {
  id: string;
  content: string;
  date: string;
  username: string;
}

export class ThreadDetailsReport {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly body: string,
    public readonly date: string,
    public readonly username: string,
    public readonly comments: Comment[],
  ) {}

  static fromQuery(
    thread: ThreadDetails,
    comments: CommentDetails[] = [],
    replies: ReplyDetails[] = [],
  ) {
    const repliesGroup = replies.reduce((acc, r) => {
      (acc[r.commentId.value] ||= []).push(r);
      return acc;
    }, {});

    const commentList: Array<Comment> = comments.map((c) => ({
      id: c.id.value,
      content: c.isDelete ? '**komentar telah dihapus**' : c.content,
      username: c.username,
      date: c.createdAt.toISOString(),
      likeCount: c.likeCount,
      replies: (repliesGroup[c.id.value] || []).map((r) => ({
        id: r.id.value,
        content: r.isDelete ? '**balasan telah dihapus**' : r.content,
        date: r.createdAt.toISOString(),
        username: r.username,
      })),
    }));

    return new ThreadDetailsReport(
      thread.id.value,
      thread.title,
      thread.body,
      thread.createdAt.toISOString(),
      thread.username,
      commentList,
    );
  }
}
