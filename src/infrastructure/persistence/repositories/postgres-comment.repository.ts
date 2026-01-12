import { Comment, CommentId } from '../../../domain/comments/comment';
import { CommentRepository } from '../../../domain/comments/comment-repository.interface';
import { Pool } from 'pg';
import {
  Inject,
  Injectable,
} from '../../../libs/my-app/common/injections/injections.decorator';
import {
  CommentMapper,
  CommentRow,
} from '../../persistence/mappers/comment.mapper';
import { QueryHelper } from '../../persistence/helper/query-helper';
import { PG_POOL } from '../../database/database.module';

@Injectable()
export class PostgresCommentRepository implements CommentRepository {
  constructor(@Inject(PG_POOL) private pool: Pool) {}

  async add(comment: Comment): Promise<void> {
    const persistence = CommentMapper.toPersistence(comment);
    const query = {
      text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6)',
      values: Object.values(persistence),
    };

    await this.pool.query(query);
  }

  async findById(id: CommentId): Promise<Comment | null> {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id.value],
    };

    const result = await this.pool.query<CommentRow>(query);
    if (result.rows.length === 0) {
      return null;
    }

    return CommentMapper.toDomain(result.rows[0]);
  }

  async existsBy(criteria: Partial<Comment>): Promise<boolean> {
    const { sql, values } = QueryHelper.buildSelectQuery(
      'comments',
      ['id'],
      CommentMapper.toPersistence(criteria),
    );

    const result = await this.pool.query(sql, values);
    return result.rows.length > 0;
  }

  async softDelete(comment: Comment): Promise<void> {
    const query = {
      text: 'UPDATE comments SET is_delete = TRUE WHERE id = $1',
      values: [comment.id.value],
    };

    await this.pool.query(query);
  }
}
