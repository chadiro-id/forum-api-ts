import { Pool } from 'pg';
import { Thread, ThreadId } from '../../../domain/threads/entities/thread';
import { ThreadRepository } from '../../../domain/threads/thread-repository.interface';
import {
  Inject,
  Injectable,
} from '../../../libs/my-app/common/injections/injections.decorator';
import { ThreadMapper } from '../../persistence/mappers/thread.mapper';
import { PG_POOL } from '../../database/database.module';

@Injectable()
export class PostgresThreadRepository implements ThreadRepository {
  constructor(@Inject(PG_POOL) private pool: Pool) {}

  async add(thread: Thread): Promise<void> {
    const persitence = ThreadMapper.toPersistence(thread);
    const query = {
      text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5)',
      values: Object.values(persitence),
    };

    await this.pool.query(query);
  }

  async existsById(id: ThreadId): Promise<boolean> {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id.value],
    };

    const result = await this.pool.query(query);
    return result.rows.length > 0;
  }
}
