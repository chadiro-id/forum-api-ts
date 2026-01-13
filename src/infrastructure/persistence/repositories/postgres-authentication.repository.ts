import { Pool } from 'pg';
import {
  Authentication,
  AuthenticationId,
} from '../../../domain/authentications/entities/authentication';
import { AuthenticationRepository } from '../../../domain/authentications/authentication-repository.interface';
import {
  Inject,
  Injectable,
} from '../../../libs/my-app/common/injections/injections.decorator';
import {
  AuthenticationMapper,
  AuthenticationRow,
} from '../../persistence/mappers/authentication.mapper';
import { PG_POOL } from '../../database/database.module';

@Injectable()
export class PostgresAuthenticationRepository implements AuthenticationRepository {
  constructor(@Inject(PG_POOL) private pool: Pool) {}

  async add(authentication: Authentication): Promise<AuthenticationId> {
    const { user_id, token } =
      AuthenticationMapper.toPersistence(authentication);

    const query = {
      text: `
        INSERT INTO authentications (user_id, token)
        VALUES ($1, $2)
        ON CONFLICT (user_id)
        DO UPDATE
        SET token = EXCLUDED.token
        RETURNING id
      `,
      values: [user_id, token],
    };

    const result = await this.pool.query(query);
    return new AuthenticationId(parseInt(result.rows[0].id as string, 10));
  }

  async findByToken(token: string): Promise<Authentication | null> {
    const query = {
      text: 'SELECT id, user_id, token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this.pool.query<AuthenticationRow>(query);
    if (!result.rows.length) return null;

    return AuthenticationMapper.toDomain(result.rows[0]);
  }

  async delete(authentication: Authentication): Promise<void> {
    const query = {
      text: 'DELETE FROM authentications WHERE id = $1',
      values: [authentication.id.value],
    };

    await this.pool.query(query);
  }
}
