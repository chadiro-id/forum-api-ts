import { Pool } from 'pg';
import usersTable from './pg-tables/users-table';
import authenticationsTable from './pg-tables/authentications-table';
import threadsTable from './pg-tables/threads-table';
import commentsTable from './pg-tables/comments-table';
import repliesTable from './pg-tables/replies-table';
import commentLikesTable from './pg-tables/comment-likes.table';

let _pool: Pool;

const setup = (pool: Pool) => {
  _pool = pool;
};

const truncate = async () => {
  const sql =
    'TRUNCATE TABLE users, authentications, threads, comments, comment_likes, replies';
  await _pool.query(sql);
};

export default {
  setup,
  truncate,
  end: () => _pool.end(),
  users: () => usersTable.createHelper(_pool),
  authentications: () => authenticationsTable.createHelper(_pool),
  threads: () => threadsTable.createHelper(_pool),
  comments: () => commentsTable.createHelper(_pool),
  commentLikes: () => commentLikesTable.createHelper(_pool),
  replies: () => repliesTable.createHelper(_pool),
};
