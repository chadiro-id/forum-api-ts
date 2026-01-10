import { UserId } from '../../../domain/entities/user';
import { Thread, ThreadId } from '../../../domain/entities/thread';
import { ThreadDetails } from '../../../application/threads/query/results/thread-details.result';

export interface ThreadRow {
  id: string;
  owner_id: string;
  title: string;
  body: string;
  created_at: Date;
}

export class ThreadMapper {
  static toDomain(row: ThreadRow) {
    const id = new ThreadId(row.id);
    const ownerId = new UserId(row.owner_id);

    return Thread.create(id, ownerId, row.title, row.body, row.created_at);
  }

  static toPersistence(entity: Thread) {
    return {
      id: entity.id.value,
      owner_id: entity.ownerId.value,
      title: entity.title,
      body: entity.body,
      created_at: entity.createdAt,
    };
  }
}

export interface ThreadDetailsRow {
  id: string;
  title: string;
  body: string;
  username: string;
  created_at: Date;
}
export class ThreadDetailsMapper {
  static toDomain(row: ThreadDetailsRow): ThreadDetails {
    const id = new ThreadId(row.id);
    return new ThreadDetails(
      id,
      row.title,
      row.body,
      row.username,
      row.created_at,
    );
  }
}
