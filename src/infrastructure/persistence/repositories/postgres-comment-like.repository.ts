import { CommentLikeRepository } from '@main/domain/comments/comment-like-repository.interface';
import {
  CommentLike,
  CommentLikeId,
} from '@main/domain/comments/entities/comment-like';
import { PG_POOL } from '@main/infrastructure/database/database.module';
import {
  Inject,
  Injectable,
} from '@main/libs/my-app/common/injections/injections.decorator';
import { Pool } from 'pg';
import {
  CommentLikeMapper,
  CommentLikeRow,
} from '../mappers/comment-like.mapper';
import { QueryHelper } from '../helper/query-helper';

@Injectable()
export class PostgresCommentLikeRepository implements CommentLikeRepository {
  constructor(@Inject(PG_POOL) private pool: Pool) {}

  async add(entity: CommentLike): Promise<CommentLikeId> {
    const query = {
      text: 'INSERT INTO comment_likes (comment_id, user_id) VALUES ($1, $2) RETURNING id',
      values: [entity.commentId.value, entity.userId.value],
    };

    const result = await this.pool.query<{ id: string }>(query);
    return new CommentLikeId(parseInt(result.rows[0].id));
  }

  async find(criteria: Partial<CommentLike>): Promise<CommentLike | null> {
    const selectCriteria = CommentLikeMapper.toPersistence(criteria);
    const { sql, values } = QueryHelper.buildSelectQuery(
      'comment_likes',
      ['id', 'comment_id', 'user_id'],
      selectCriteria,
    );

    const result = await this.pool.query<CommentLikeRow>(sql, values);
    return result.rows.length > 0
      ? CommentLikeMapper.toDomain(result.rows[0])
      : null;
  }

  async delete(entity: CommentLike): Promise<void> {
    const query = {
      text: 'DELETE FROM comment_likes WHERE id = $1',
      values: [entity.id.value],
    };

    await this.pool.query(query);
  }
}
