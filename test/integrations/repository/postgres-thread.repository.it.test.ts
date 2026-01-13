import {
  DatabaseModule,
  PG_POOL,
} from '@main/infrastructure/database/database.module';
import { PostgresThreadRepository } from '@main/infrastructure/persistence/repositories/postgres-thread.repository';
import Test from '@main/libs/my-app/testing/test-utils';
import { Pool } from 'pg';
import pgTest from '@test/helper/database/postgres-test.helper';
import { createThreadData, createUserData } from '@test/helper/data-factory';
import { Thread, ThreadId } from '@main/domain/threads/entities/thread';
import { UserId } from '@main/domain/users/entities/user';
import { ConfigModule } from '@main/infrastructure/config/config.module';

let threadRepository: PostgresThreadRepository;

beforeAll(async () => {
  const moduleRef = Test.createTestingModule({
    providers: [
      { provide: PostgresThreadRepository, useClass: PostgresThreadRepository },
    ],
    imports: [ConfigModule, DatabaseModule],
  });
  const pool: Pool = moduleRef.resolve(PG_POOL);

  threadRepository = moduleRef.resolve(PostgresThreadRepository);

  pgTest.setup(pool);
  await pgTest.truncate();
});

afterAll(async () => {
  await pgTest.end();
});

describe('PostgresThreadRepository', () => {
  const userData = createUserData();

  beforeAll(async () => {
    await pgTest.users().add(userData);
  });

  afterAll(async () => {
    await pgTest.users().cleanup();
  });

  afterEach(async () => {
    await pgTest.threads().cleanup();
  });

  describe('add', () => {
    it('should persist Thread data', async () => {
      const id = new ThreadId('thread-001');
      const ownerId = new UserId(userData.id);

      const thread = Thread.create(id, ownerId, 'Sebuah thread', 'Isi thread');
      await threadRepository.add(thread);

      const threads = await pgTest.threads().findById('thread-001');
      expect(threads).toStrictEqual([
        {
          id: thread.id.value,
          owner_id: thread.ownerId.value,
          title: thread.title,
          body: thread.body,
          created_at: thread.createdAt,
        },
      ]);
    });
  });

  describe('existsById', () => {
    it('should return true when exists', async () => {
      const threadData = createThreadData({ owner_id: userData.id });
      await pgTest.threads().add(threadData);

      const threadId = new ThreadId(threadData.id);
      const exists = await threadRepository.existsById(threadId);
      expect(exists).toBe(true);
    });

    it('should return false when not exists', async () => {
      const id = new ThreadId('non-existence-id');

      const exists = await threadRepository.existsById(id);
      expect(exists).toBe(false);
    });
  });
});
