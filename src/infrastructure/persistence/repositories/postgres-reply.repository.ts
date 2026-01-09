import { Pool } from 'pg';
import { Reply, ReplyId } from '../../../domain/entities/reply';
import { ReplyRepository } from '../../../domain/repositories/reply-repository.interface';
import {
  Inject,
  Injectable,
} from '../../../libs/my-app/common/injections/injections.decorator';
import { ReplyMapper, ReplyRow } from '../../persistence/mappers/reply.mapper';
import { QueryHelper } from '../../persistence/helper/query-helper';
import { PG_POOL } from '../../database/database.module';

@Injectable()
export class PostgresReplyRepository implements ReplyRepository {
  constructor(@Inject(PG_POOL) private pool: Pool) {}

  async add(reply: Reply): Promise<void> {
    const persistence = ReplyMapper.toPersistence(reply);
    const query = {
      text: 'INSERT INTO replies VALUES ($1, $2, $3, $4, $5, $6)',
      values: Object.values(persistence),
    };

    await this.pool.query(query);
  }

  async findById(id: ReplyId): Promise<Reply | null> {
    const query = {
      text: `
      SELECT r.*, c.thread_id
      FROM replies r
      JOIN comments c ON r.comment_id = c.id
      WHERE r.id = $1
      `,
      values: [id.value],
    };

    const result = await this.pool.query<ReplyRow>(query);
    if (result.rows.length === 0) {
      return null;
    }

    return ReplyMapper.toDomain(result.rows[0]);
  }

  async updateById(id: ReplyId, changes: Partial<Reply>): Promise<void> {
    const { sql, values } = QueryHelper.buildUpdateQuery(
      'replies',
      { id: id.value },
      ReplyMapper.toPersistence(changes),
    );

    await this.pool.query(sql, values);
  }
}
