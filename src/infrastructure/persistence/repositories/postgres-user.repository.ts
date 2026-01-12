import { User } from '../../../domain/users/user';
import { UserRepository } from '../../../domain/users/user-repository.interface';
import {
  Inject,
  Injectable,
} from '../../../libs/my-app/common/injections/injections.decorator';
import { Pool } from 'pg';
import { UserMapper, UserRow } from '../../persistence/mappers/user.mapper';
import { PG_POOL } from '../../database/database.module';

@Injectable()
export class PostgresUserRepository implements UserRepository {
  constructor(@Inject(PG_POOL) private pool: Pool) {}

  async add(user: User): Promise<void> {
    const persistence = UserMapper.toPersistence(user);
    const query = {
      text: 'INSERT INTO users VALUES ($1, $2, $3, $4, $5)',
      values: Object.values(persistence),
    };

    await this.pool.query(query);
  }

  async findByUsername(username: string): Promise<User | null> {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.pool.query<UserRow>(query);
    if (!result.rows.length) {
      return null;
    }

    return UserMapper.toDomain(result.rows[0]);
  }

  async existsByUsername(username: string): Promise<boolean> {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.pool.query(query);
    return result.rows.length > 0;
  }
}
