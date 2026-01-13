import { Pool } from 'pg';
import {
  DatabaseModule,
  PG_POOL,
} from '@main/infrastructure/database/database.module';
import { PostgresUserRepository } from '@main/infrastructure/persistence/repositories/postgres-user.repository';
import { UserId, User } from '@main/domain/users/entities/user';
import Test from '@main/libs/my-app/testing/test-utils';
import pgTest from '@test/helper/database/postgres-test.helper';
import { createUserData } from '@test/helper/data-factory';
import { ConfigModule } from '@main/infrastructure/config/config.module';

let userRepository: PostgresUserRepository;

beforeAll(async () => {
  const moduleRef = Test.createTestingModule({
    providers: [
      { provide: PostgresUserRepository, useClass: PostgresUserRepository },
    ],
    imports: [ConfigModule, DatabaseModule],
  });
  const pool: Pool = moduleRef.resolve(PG_POOL);

  userRepository = moduleRef.resolve(PostgresUserRepository);
  pgTest.setup(pool);

  await pgTest.truncate();
});

afterAll(async () => {
  await pgTest.end();
});

describe('PostgresUserRepository', () => {
  afterEach(async () => {
    await pgTest.users().cleanup();
  });

  describe('add', () => {
    it('should persist User data', async () => {
      const id = new UserId('user-123');
      const user = User.create(id, 'johndoe', 'p455w0rd', 'John Doe');

      await userRepository.add(user);

      const users = await pgTest.users().findById('user-123');
      expect(users).toStrictEqual([
        {
          id: user.id.value,
          username: user.username,
          password: user.password,
          fullname: user.fullname,
          created_at: user.createdAt,
        },
      ]);
    });
  });

  describe('findByUsername', () => {
    it('should return User entity', async () => {
      const userData = createUserData();
      const expectedUser = User.create(
        new UserId(userData.id),
        userData.username,
        userData.password,
        userData.fullname,
        new Date(userData.created_at),
      );

      await pgTest.users().add(userData);

      const user = await userRepository.findByUsername('johndoe');
      expect(user).toStrictEqual(expectedUser);
    });

    it('should return null when username not exists', async () => {
      const user = await userRepository.findByUsername('johndoe');
      expect(user).toBeNull();
    });
  });

  describe('existsByUsername', () => {
    it('should return true when username exists', async () => {
      const userData = createUserData({ username: 'johndoe' });

      await pgTest.users().add(userData);

      const exists = await userRepository.existsByUsername('johndoe');
      expect(exists).toBe(true);
    });

    it('should return false when username not exists', async () => {
      const exists = await userRepository.existsByUsername('non-exists');
      expect(exists).toBe(false);
    });
  });
});
