import {
  ThreadDetails,
  CommentDetails,
  ReplyDetails,
} from '../../../application/threads/query/results/thread-details.result';
import { CommentId } from '../../../domain/comments/comment';
import { ThreadId } from '../../../domain/threads/thread';
import { ThreadDetailsQueryService } from '../../../application/threads/interfaces/thread-details-query-service.interface';
import { Inject } from '../../../libs/my-app/common/injections/injections.decorator';
import {
  ThreadDetailsMapper,
  ThreadDetailsRow,
} from '../mappers/thread.mapper';
import {
  CommentDetailsMapper,
  CommentDetailsRow,
} from '../mappers/comment.mapper';
import { ReplyDetailsMapper, ReplyDetailsRow } from '../mappers/reply.mapper';
import { PG_POOL } from '../../database/database.module';
import { Pool } from 'pg';

export class PostgresThreadDetailsQueryService implements ThreadDetailsQueryService {
  constructor(@Inject(PG_POOL) private pool: Pool) {}

  async getById(id: ThreadId): Promise<ThreadDetails | null> {
    const query = {
      text: `
      SELECT
        t.id, t.title, t.body, t.created_at, u.username
      FROM
        threads t
      LEFT JOIN
        users u
      ON
        u.id = t.owner_id
      WHERE
        t.id = $1
      `,
      values: [id.value],
    };

    const result = await this.pool.query<ThreadDetailsRow>(query);
    return result.rows.length > 0
      ? ThreadDetailsMapper.toDomain(result.rows[0])
      : null;
  }

  async getCommentsById(id: ThreadId): Promise<CommentDetails[]> {
    const query = {
      text: `
      SELECT
        c.id, c.content, c.created_at, c.is_delete, u.username
      FROM
        comments c
      LEFT JOIN
        users u
      ON
        u.id = c.owner_id
      WHERE
        c.thread_id = $1
      ORDER BY
        c.created_at ASC
      `,
      values: [id.value],
    };

    const result = await this.pool.query<CommentDetailsRow>(query);
    return result.rows.map((row) => CommentDetailsMapper.toDomain(row));
  }

  async getRepliesByCommentIds(
    commentIds: CommentId[],
  ): Promise<ReplyDetails[]> {
    const query = {
      text: `
      SELECT
        r.id, r.content, r.comment_id, r.created_at, r.is_delete, u.username
      FROM
        replies r
      LEFT JOIN
        users u
      ON
        u.id = r.owner_id
      WHERE
        r.comment_id = ANY($1::text[])
      ORDER BY
        r.created_at ASC
      `,
      values: [commentIds.map(({ value }) => value)],
    };

    const result = await this.pool.query<ReplyDetailsRow>(query);
    return result.rows.map((row) => ReplyDetailsMapper.toDomain(row));
  }
}
